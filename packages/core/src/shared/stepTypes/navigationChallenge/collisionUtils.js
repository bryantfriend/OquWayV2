export function hasCollision(first, second, distance) {
  var dx = Number(first.x) - Number(second.x);
  var dy = Number(first.y) - Number(second.y);
  var radius = Number(distance) || 8;

  return Math.sqrt((dx * dx) + (dy * dy)) <= radius;
}
