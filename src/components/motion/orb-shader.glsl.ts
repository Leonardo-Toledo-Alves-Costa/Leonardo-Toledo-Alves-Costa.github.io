/** Triângulo que cobre a tela (3 vértices, sem buffer de índices). */
export const ORB_VERTEX = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

/**
 * Esfera Abissal (spec §4.3; base: prototipos/redesign-abissal/prototipo-orbe.html).
 * Desenha só a esfera dentro da caixa quadrada, com fundo transparente: o halo e o fundo
 * da página continuam em CSS. Saída em alfa pré-multiplicado.
 */
export const ORB_FRAGMENT = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uIntro;
uniform float uExpand;
uniform vec3 uAbyss;
uniform vec3 uDeep;
uniform vec3 uGlow;
uniform vec3 uAccent;
uniform vec3 uHi;

float hash(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float noise(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash(i), hash(i + vec3(1, 0, 0)), f.x), mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
    mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x), mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y),
    f.z
  );
}

float fbm(vec3 p) {
  float a = 0.5;
  float s = 0.0;
  for (int k = 0; k < 5; k++) {
    s += a * noise(p);
    p *= 2.03;
    a *= 0.5;
  }
  return s;
}

void main() {
  vec2 uv = (gl_FragCoord.xy / uRes) * 2.0 - 1.0;
  float d = length(uv);
  float aa = 3.0 / uRes.x;
  float alpha = (1.0 - smoothstep(1.0 - aa, 1.0, d)) * uIntro;
  if (alpha <= 0.0) {
    gl_FragColor = vec4(0.0);
    return;
  }

  vec3 n = vec3(uv, sqrt(max(1.0 - d * d, 0.0)));
  float t = uTime * 0.08;
  vec3 w = n * 2.2 + vec3(t, t * 0.6, 0.0);
  float f = fbm(w + fbm(w * 1.7 - t) * 1.4);

  vec3 light = normalize(vec3(-0.5, 0.6, 0.65));
  float dif = clamp(dot(n, light), 0.0, 1.0);
  vec3 base = mix(uDeep * 0.6, uAccent * 0.55, f);
  vec3 col = base * (0.25 + 0.9 * dif);
  col += uHi * pow(clamp(dot(reflect(-light, n), vec3(0.0, 0.0, 1.0)), 0.0, 1.0), 18.0) * 0.55;
  col += uAccent * pow(1.0 - n.z, 2.5) * 0.9;
  col += uHi * smoothstep(0.62, 0.9, f) * 0.25 * dif;
  col = mix(col, uGlow * 0.15 + mix(uDeep, uAbyss, 0.5) + uAccent * 0.05 * f, smoothstep(0.15, 0.7, uExpand));
  col += (hash(vec3(gl_FragCoord.xy, uTime)) - 0.5) * 0.02;

  // Alfa pré-multiplicado só é válido com rgb ≤ alfa: limita antes de multiplicar.
  col = clamp(col, 0.0, 1.0);
  gl_FragColor = vec4(col * alpha, alpha);
}
`;
