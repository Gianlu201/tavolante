/**
 * Deterministic pseudo-random value in [0, 1) for item `i`: decorations get a
 * scattered look without Math.random during render, and the same scene every time.
 */
export const scatter = (i: number, salt: number) => {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453
  return x - Math.floor(x)
}
