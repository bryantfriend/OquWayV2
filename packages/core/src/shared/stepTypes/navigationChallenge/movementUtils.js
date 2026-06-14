export function updateAvatarMovement(avatar, input, useInertia) {
  var next = Object.assign({}, avatar);
  var accel = useInertia ? 1.7 : 4.6;

  if (input.left) { next.vx = next.vx - accel; }
  if (input.right) { next.vx = next.vx + accel; }
  if (input.up) { next.vy = next.vy - accel; }
  if (input.down) { next.vy = next.vy + accel; }

  if (!useInertia) {
    next.vx = (input.left ? -4.6 : 0) + (input.right ? 4.6 : 0);
    next.vy = (input.up ? -4.6 : 0) + (input.down ? 4.6 : 0);
  }

  next.vx = clamp(next.vx * 0.82, -7, 7);
  next.vy = clamp(next.vy * 0.82, -7, 7);
  next.x = clamp(next.x + next.vx, 5, 95);
  next.y = clamp(next.y + next.vy, 8, 92);

  return next;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
