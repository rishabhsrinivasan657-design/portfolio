uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform float uOpacity;
uniform float uScroll;

varying float vNoise;
varying float vDepth;

void main() {
  // Round the square point sprite off, and soften its edge.
  vec2 uv = gl_PointCoord - 0.5;
  float dist = dot(uv, uv);
  if (dist > 0.25) discard;
  float mask = smoothstep(0.25, 0.03, dist);

  float t = clamp(vNoise * 0.9 + 0.5, 0.0, 1.0);

  vec3 color = mix(uColorA, uColorB, smoothstep(0.12, 0.88, t));
  // The warm accent is rationed: only the highest crests, and only once the
  // visitor has started moving down the page.
  color = mix(color, uColorC, smoothstep(0.66, 1.0, t) * (0.32 + uScroll * 0.5));

  // Fade the far side of the sphere so the near surface stays readable.
  float depthFade = smoothstep(90.0, 34.0, vDepth);

  gl_FragColor = vec4(color, mask * uOpacity * (0.36 + 0.64 * t) * depthFade);
}
