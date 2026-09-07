import { useReducedMotion, useScroll, useSpring } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import {
  AdditiveBlending,
  Color,
  Group,
  LineSegments,
  NormalBlending,
  PerspectiveCamera,
  Points,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  Vector2,
  WebGLRenderer,
} from 'three';
import { glColors, useTheme } from '~/components/theme';
import { Transition } from '~/components/transition';
import { useInViewport, useWindowSize } from '~/hooks';
import { media } from '~/utils/style';
import { throttle } from '~/utils/throttle';
import { cleanRenderer, cleanScene, createGraticule } from '~/utils/three';
import linesFragmentShader from './shaders/field-lines-fragment.glsl?raw';
import noiseChunk from './shaders/noise.glsl?raw';
import pointsFragmentShader from './shaders/field-points-fragment.glsl?raw';
import baseVertexShader from './shaders/field-vertex.glsl?raw';
import styles from './field.module.css';

const vertexShader = `${noiseChunk}\n${baseVertexShader}`;

const springConfig = { stiffness: 30, damping: 20, mass: 2 };

/** Point and line counts, tuned per device class. */
function getDetail(width: number) {
  if (width <= media.mobile) {
    return {
      segments: [64, 40] as const,
      graticule: { latitudes: 9, longitudes: 12, resolution: 40 },
      pointSize: 1.9,
      maxPixelRatio: 1,
    };
  }

  if (width <= media.tablet) {
    return {
      segments: [104, 64] as const,
      graticule: { latitudes: 11, longitudes: 16, resolution: 56 },
      pointSize: 1.7,
      maxPixelRatio: 1.5,
    };
  }

  return {
    segments: [168, 104] as const,
    graticule: { latitudes: 13, longitudes: 20, resolution: 72 },
    pointSize: 1.65,
    maxPixelRatio: 1.75,
  };
}

const RADIUS = 26;

/**
 * The hero environment: a lat/long lattice of points wrapped in a coordinate
 * graticule, both displaced by the same noise field so they move as one
 * object. It drifts on its own, leans toward the pointer, and grows more
 * turbulent as the page scrolls.
 */
export const Field = (props: React.HTMLAttributes<HTMLCanvasElement>) => {
  const { theme } = useTheme();
  const start = useRef(Date.now());
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderer = useRef<WebGLRenderer>();
  const camera = useRef<PerspectiveCamera>();
  const scene = useRef<Scene>();
  const group = useRef<Group>();
  const pointsMaterial = useRef<ShaderMaterial>();
  const linesMaterial = useRef<ShaderMaterial>();
  const mouse = useRef(new Vector2(0.4, 0.5));

  const reduceMotion = useReducedMotion();
  const isInViewport = useInViewport(canvasRef);
  const windowSize = useWindowSize();

  // The canvas is fixed, so it stays behind the whole page rather than
  // scrolling away with the hero. Past the hero it drops to a low opacity so
  // it reads as atmosphere and never competes with body copy.
  const [dimmed, setDimmed] = useState(false);
  const [documentHidden, setDocumentHidden] = useState(false);

  const rotationX = useSpring(0, springConfig);
  const rotationY = useSpring(0, springConfig);

  const { scrollYProgress } = useScroll();
  const scrollSpring = useSpring(scrollYProgress, {
    stiffness: 40,
    damping: 24,
    mass: 1,
  });

  // ---- Scene setup -------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { innerWidth, innerHeight } = window;
    const detail = getDetail(innerWidth);

    let instance: WebGLRenderer;

    try {
      instance = new WebGLRenderer({
        canvas,
        antialias: false,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      // No usable WebGL context. The hero still reads without it.
      return;
    }

    renderer.current = instance;
    instance.setSize(innerWidth, innerHeight);
    instance.setPixelRatio(Math.min(window.devicePixelRatio, detail.maxPixelRatio));
    // Transparent clear is the default with `alpha: true`, but some software
    // rasterisers composite an opaque buffer unless it is stated outright.
    instance.setClearColor(0x000000, 0);

    // The sphere has to stay a bounded object. If the frustum sits inside the
    // point cloud, additive blending accumulates on every pixel and the whole
    // canvas washes out to white.
    camera.current = new PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 200);
    camera.current.position.z = 64;

    scene.current = new Scene();
    group.current = new Group();
    scene.current.add(group.current);

    const uniforms = {
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uAmplitude: { value: 7.5 },
      uSize: { value: detail.pointSize },
      uPixelRatio: { value: instance.getPixelRatio() },
      uOpacity: { value: 1 },
      uColorA: { value: new Color() },
      uColorB: { value: new Color() },
      uColorC: { value: new Color() },
    };

    pointsMaterial.current = new ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader: pointsFragmentShader,
      transparent: true,
      depthWrite: false,
    });

    // Lines share the uniform object, so a single update drives both passes.
    linesMaterial.current = new ShaderMaterial({
      uniforms: { ...uniforms, uOpacity: { value: 0.22 } },
      vertexShader,
      fragmentShader: linesFragmentShader,
      transparent: true,
      depthWrite: false,
    });

    const pointsGeometry = new SphereGeometry(
      RADIUS,
      detail.segments[0],
      detail.segments[1]
    );
    const graticuleGeometry = createGraticule({
      radius: RADIUS * 1.012,
      ...detail.graticule,
    });

    group.current.add(new Points(pointsGeometry, pointsMaterial.current));
    group.current.add(new LineSegments(graticuleGeometry, linesMaterial.current));

    return () => {
      cleanScene(scene.current);
      cleanRenderer(renderer.current);
      renderer.current = undefined;
    };
  }, []);

  // ---- Theme -------------------------------------------------------------
  useEffect(() => {
    const palette = glColors[theme] ?? glColors.dark;
    const materials = [pointsMaterial.current, linesMaterial.current];

    for (const material of materials) {
      if (!material) continue;
      material.uniforms.uColorA.value.set(palette.primary);
      material.uniforms.uColorB.value.set(palette.accent);
      material.uniforms.uColorC.value.set(palette.signal);
      // Additive glows on a near-black ground; on the light theme it would
      // just wash the field out, so blend normally there instead.
      material.blending = theme === 'dark' ? AdditiveBlending : NormalBlending;
      material.needsUpdate = true;
    }

    if (pointsMaterial.current) {
      pointsMaterial.current.uniforms.uOpacity.value = theme === 'dark' ? 0.85 : 0.7;
    }
    if (linesMaterial.current) {
      linesMaterial.current.uniforms.uOpacity.value = theme === 'dark' ? 0.34 : 0.42;
    }
  }, [theme]);

  // ---- Resize ------------------------------------------------------------
  useEffect(() => {
    if (!renderer.current || !camera.current || !group.current) return;

    const { width, height } = windowSize;

    // Overshoot the height so the sphere still bleeds off the bottom edge
    // when the mobile URL bar collapses.
    const adjustedHeight = height + height * 0.3;
    renderer.current.setSize(width, adjustedHeight);
    camera.current.aspect = width / adjustedHeight;
    camera.current.updateProjectionMatrix();

    // A narrow viewport has a narrow frustum, so the sphere has to shrink as
    // well as move — otherwise the camera ends up inside the point cloud and
    // the globe reads as scattered noise rather than an object.
    if (width <= media.mobile) {
      group.current.scale.setScalar(0.48);
      group.current.position.set(8, 20, 0);
    } else if (width <= media.tablet) {
      group.current.scale.setScalar(0.74);
      group.current.position.set(15, 11, 0);
    } else {
      group.current.scale.setScalar(1);
      group.current.position.set(24, 13, 0);
    }

    if (reduceMotion && scene.current) {
      renderer.current.render(scene.current, camera.current);
    }
  }, [reduceMotion, windowSize]);

  // ---- Pointer -----------------------------------------------------------
  useEffect(() => {
    if (reduceMotion || !isInViewport) return;

    const onMouseMove = throttle((event: MouseEvent) => {
      mouse.current.set(
        event.clientX / window.innerWidth,
        event.clientY / window.innerHeight
      );

      rotationX.set(mouse.current.y / 2);
      rotationY.set(mouse.current.x / 2);
    }, 100);

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [isInViewport, reduceMotion, rotationX, rotationY]);

  // ---- Dim past the hero, and stand down in a background tab -------------
  useEffect(() => {
    const onScroll = throttle(() => {
      setDimmed(window.scrollY > window.innerHeight * 0.9);
    }, 150);

    const onVisibility = () => setDocumentHidden(document.hidden);

    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    onScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  // ---- Frame loop --------------------------------------------------------
  useEffect(() => {
    if (!renderer.current || !scene.current || !camera.current) return;

    let animation = 0;

    const animate = () => {
      animation = requestAnimationFrame(animate);

      const elapsed = (Date.now() - start.current) * 0.00006;
      const scroll = scrollSpring.get();

      for (const material of [pointsMaterial.current, linesMaterial.current]) {
        if (!material) continue;
        material.uniforms.uTime.value = elapsed;
        material.uniforms.uScroll.value = scroll;
      }

      if (group.current) {
        group.current.rotation.z += 0.0006;
        group.current.rotation.x = rotationX.get();
        group.current.rotation.y = rotationY.get() + elapsed * 0.6;
      }

      renderer.current!.render(scene.current!, camera.current!);
    };

    // Below tablet the field keeps drawing only while the hero is on screen —
    // a continuous shader for the length of the page is not worth the battery
    // on a phone, and at 22% opacity a still frame is indistinguishable.
    const pauseWhenDimmed = windowSize.width <= media.tablet;
    const shouldAnimate =
      !reduceMotion && isInViewport && !documentHidden && !(dimmed && pauseWhenDimmed);

    if (shouldAnimate) {
      animate();
    } else {
      renderer.current.render(scene.current, camera.current);
    }

    return () => cancelAnimationFrame(animation);
  }, [
    isInViewport,
    reduceMotion,
    rotationX,
    rotationY,
    scrollSpring,
    dimmed,
    documentHidden,
    windowSize.width,
  ]);

  return (
    <Transition in timeout={3000} nodeRef={canvasRef}>
      {({ visible }) => (
        <canvas
          aria-hidden
          className={styles.canvas}
          data-visible={visible}
          data-dimmed={dimmed}
          ref={canvasRef}
          {...props}
        />
      )}
    </Transition>
  );
};
