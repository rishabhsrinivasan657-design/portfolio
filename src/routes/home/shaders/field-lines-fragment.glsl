uniform vec3 uColorA;
uniform vec3 uColorB;
uniform float uOpacity;

varying float vNoise;
varying float vDepth;

void main() {
  float t = clamp(vNoise * 0.9 + 0.5, 0.0, 1.0);
  vec3 color = mix(uColorA, uColorB, smoothstep(0.2, 0.9, t));
  float depthFade = smoothstep(88.0, 32.0, vDepth);

  gl_FragColor = vec4(color, uOpacity * (0.25 + 0.75 * t) * depthFade);
}
