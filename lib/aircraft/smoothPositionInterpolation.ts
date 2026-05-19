export type Point = {
  x: number;
  y: number;
};

export function smoothPositionInterpolation(from: Point, to: Point, progress: number): Point {
  const eased = 1 - Math.pow(1 - Math.min(1, Math.max(0, progress)), 3);

  return {
    x: from.x + (to.x - from.x) * eased,
    y: from.y + (to.y - from.y) * eased
  };
}
