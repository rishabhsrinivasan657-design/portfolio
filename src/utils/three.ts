import { BufferAttribute, BufferGeometry, Material, Mesh, type Scene, type WebGLRenderer } from 'three';

/** Dispose every geometry and material in a scene graph */
export const cleanScene = (scene?: Scene | null) => {
  scene?.traverse(object => {
    const mesh = object as Mesh;
    if (!mesh.geometry) return;

    mesh.geometry.dispose();

    const material = mesh.material as Material | Material[] | undefined;
    if (!material) return;

    if (Array.isArray(material)) {
      material.forEach(cleanMaterial);
    } else {
      cleanMaterial(material);
    }
  });
};

/** Dispose a material and any textures hanging off it */
export const cleanMaterial = (material: Material) => {
  material.dispose();

  for (const key of Object.keys(material)) {
    const value = (material as unknown as Record<string, unknown>)[key];
    if (value && typeof value === 'object' && 'minFilter' in value) {
      (value as unknown as { dispose: () => void }).dispose();
    }
  }
};

/**
 * Dispose only — deliberately not `forceContextLoss()`. That call
 * permanently prevents the canvas element from ever handing out another
 * context, so React StrictMode's double-mount would leave the surviving
 * renderer drawing into a dead context.
 */
export const cleanRenderer = (renderer?: WebGLRenderer | null) => {
  renderer?.dispose();
};

/**
 * Builds a coordinate graticule — rings of latitude and meridians of
 * longitude — as one LineSegments geometry.
 *
 * A wireframe of the point sphere would include triangle diagonals and read
 * as mesh; a graticule reads as a coordinate system, which is the point.
 */
export function createGraticule({
  radius,
  latitudes,
  longitudes,
  resolution,
}: {
  radius: number;
  latitudes: number;
  longitudes: number;
  resolution: number;
}) {
  const points: number[] = [];

  const pushSegment = (
    theta1: number,
    phi1: number,
    theta2: number,
    phi2: number
  ) => {
    // theta: polar angle from +Y, phi: azimuth
    points.push(
      radius * Math.sin(theta1) * Math.cos(phi1),
      radius * Math.cos(theta1),
      radius * Math.sin(theta1) * Math.sin(phi1),
      radius * Math.sin(theta2) * Math.cos(phi2),
      radius * Math.cos(theta2),
      radius * Math.sin(theta2) * Math.sin(phi2)
    );
  };

  // Rings of latitude, skipping the poles where they collapse to a point
  for (let lat = 1; lat < latitudes; lat++) {
    const theta = (lat / latitudes) * Math.PI;
    for (let step = 0; step < resolution; step++) {
      const phi1 = (step / resolution) * Math.PI * 2;
      const phi2 = ((step + 1) / resolution) * Math.PI * 2;
      pushSegment(theta, phi1, theta, phi2);
    }
  }

  // Meridians of longitude, pole to pole
  for (let lon = 0; lon < longitudes; lon++) {
    const phi = (lon / longitudes) * Math.PI * 2;
    for (let step = 0; step < resolution; step++) {
      const theta1 = (step / resolution) * Math.PI;
      const theta2 = ((step + 1) / resolution) * Math.PI;
      pushSegment(theta1, phi, theta2, phi);
    }
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new BufferAttribute(new Float32Array(points), 3));

  return geometry;
}
