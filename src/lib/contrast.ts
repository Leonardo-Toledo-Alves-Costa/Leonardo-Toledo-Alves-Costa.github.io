/** Canal sRGB (0–255) linearizado, como na definição de luminância relativa do WCAG 2.x. */
function linear(channel: number): number {
  const c = channel / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/** Luminância relativa de uma cor "#RRGGBB". */
function luminance(hex: string): number {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) throw new Error(`contrast: hex inválido "${hex}"`);
  const r = linear(parseInt(hex.slice(1, 3), 16));
  const g = linear(parseInt(hex.slice(3, 5), 16));
  const b = linear(parseInt(hex.slice(5, 7), 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** Razão de contraste WCAG entre duas cores "#RRGGBB" (1 a 21). */
export function contrastRatio(fg: string, bg: string): number {
  const a = luminance(fg);
  const b = luminance(bg);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
