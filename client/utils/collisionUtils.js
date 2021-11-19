import {
  SPRITE_HEIGHT,
  SPRITE_WIDTH,
  SPRITE_OVERSIZE_HEIGHT,
  SPRITE_OVERSIZE_WIDTH,
  DIRECTIONS
} from '/client/common';

export function isBetween(a1, a2, b) {
  return ((a1 <= b) && (b <= a2)) || ((a1 >= b) && (b >= a2));
}

export function collision([ax1,ay1,ax2,ay2],[bx1,by1,bx2,by2]) {
  const bxInBetween = isBetween(ax1,ax2,bx1) || isBetween(ax1,ax2,bx2);
  const axInBetween = isBetween(bx1,bx2,ax1) || isBetween(bx1,bx2,ax2);
  if(bxInBetween || axInBetween) {
    const byInBetween = isBetween(ay1,ay2,by1) || isBetween(ay1,ay2,by2);
    const ayInBetween = isBetween(by1,by2,ay1) || isBetween(by1,by2,ay2);
    return (byInBetween || ayInBetween);
  }
}

export function within(x, y, [ax1, ay1, ax2, ay2]) {
  return isBetween(ax1, ax2, x) && isBetween(ay1, ay2, y);
}

export function getRadians([ax1,ay1,ax2,ay2],[bx1,by1,bx2,by2]) {
  const c1 = [(ax2 + ax1)/2, (ay2 + ay1)/2];
  const c2 = [(bx2 + bx1)/2, (by2 + by1)/2];
  const dy = c1[1] - c2[1];
  const dx = c1[0] - c2[0];
  const slope = dy/dx;
  const pi = Math.PI;
  let radians = Math.atan(slope);

  if(dy === 0) {
    if(dx > 0) radians = pi;
    if(dx < 0) radians = 0;
  }
  else if(dy < 0 && dx < 0) { // q1
    radians = Math.abs(radians);
  }
  else if(dy < 0 && dx > 0) { // q2
    radians = pi - Math.abs(radians);
  }
  else if(dy > 0 && dx > 0) { // q3
    radians = radians + pi;
  }
  else if(dy > 0 && dx < 0) { // q4
    radians = pi*2 - Math.abs(radians);
  }

  return radians;
}

export function directionTo([ax1,ay1,ax2,ay2],[bx1,by1,bx2,by2]) {
  const c1 = [(ax2 + ax1)/2, (ay2 + ay1)/2];
  const c2 = [(bx2 + bx1)/2, (by2 + by1)/2];
  const dy = c1[1] - c2[1];
  const dx = c1[0] - c2[0];

  if(Math.abs(dx) > Math.abs(dy)) {
    if(c2[0] > c1[0]) {
      return DIRECTIONS.RIGHT;
    }
    if(c2[0] < c1[0]) {
      return DIRECTIONS.LEFT;
    }
  }
  else {
    if(c2[1] > c1[1]) {
      return DIRECTIONS.UP;
    }
    if(c2[1] < c1[1]) {
      return DIRECTIONS.DOWN;
    }
  }
}

export function getBox(char) {
  const width = (SPRITE_WIDTH * char.boxWidth);
  let x1 = char.x + (SPRITE_WIDTH / 2) - width/2;
  let y1 = char.y;
  let x2 = x1 + width;
  let y2 = y1 + SPRITE_HEIGHT - char.heightOffset;
  return [x1,y1,x2,y2]
}

export function drawBox(ctx, [x1,y1,x2,y2]) {
  ctx.beginPath();
  ctx.rect(x1, ctx.canvas.height - y1, x2-x1, y1-y2);
  ctx.stroke();
}

export function degToRad(degrees) {
  return degrees * (Math.PI / 180);
};
