uniform float uTime;
uniform float uScroll;
uniform float uAmplitude;
uniform float uSize;
uniform float uPixelRatio;

varying float vNoise;
varying float vDepth;

void main() {
  vec3 pos = position;

  float n = fieldNoise(pos, uTime);

  // The field grows more turbulent as the page scrolls, so the environment
  // reads as responding to progress rather than looping on a timer.
  float amplitude = uAmplitude * (0.72 + uScroll * 0.85);
  vec3 displaced = pos + normalize(pos) * n * amplitude;

  vNoise = n;

  vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
  vDepth = -mvPosition.z;

  // Crests get bigger points, which reads as density rather than scale.
  float crest = 0.55 + 0.8 * smoothstep(-0.35, 0.65, n);
  gl_PointSize = uSize * uPixelRatio * crest * (60.0 / max(vDepth, 0.001));

  gl_Position = projectionMatrix * mvPosition;
}
