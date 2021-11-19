import {loadImage} from '/client/utils/loadImages';
import state from '/client/state/index';
import {
  DIRECTIONS
} from '/client/common';
import {
  canMove,
  outOfBounds,
  isWater,
  isType,
  tilesWithinBox,
} from '/client/utils/tileUtils';
import {
  collision,
  getRadians,
  getBox,
} from '/client/utils/collisionUtils';
import IceBox from '/client/objects/IceBox';

const SPRITE_HEIGHT = 64;
const SPRITE_WIDTH = 96;

class IceOrb {
  speed = 8;
  cycle = 0;
  maxTimeout = 18;
  constructor(spellcaster, x, y, direction, img) {
    this.spellcaster = spellcaster;
    this.direction = direction;
    this.img = img;
    this.x = x;
    this.y = y;
    this.timeout = this.maxTimeout;
  }
  hitBox() {
    const width = 32;
    const height = 32;
    const x1 = this.x + 22;
    const y1 = this.y + 32;
    const x2 = x1 + width;
    const y2 = y1 + height;
    return [x1,y1,x2,y2];
  }
  update() {
    const { frame, scene: { enemies }} = state;
    if(this.direction === 0) {
      this.direction = DIRECTIONS.UP;
      this.y += this.speed;
    }
    else if(this.direction === 1) {
      this.direction = DIRECTIONS.LEFT;
      this.x -= this.speed;
    }
    else if(this.direction === 2) {
      this.direction = DIRECTIONS.DOWN;
      this.y -= this.speed;
    }
    else if(this.direction === 3) {
      this.direction = DIRECTIONS.RIGHT;
      this.x += this.speed;
    }
    enemies.forEach((enemy) => {
      if(collision(this.hitBox(), getBox(enemy))) {
        enemy.health -= 25;
        enemy.freeze = 15;
        enemy.aggro(this.spellcaster);
        state.destroyObject(this);
      }
    });
    const hitBoxTiles = tilesWithinBox(this.hitBox());
    for(let i = 0; i < hitBoxTiles.length; i++) {
      const [x,y] = hitBoxTiles[i];
      if(isWater(x, y)) {
        state.addObject(new IceBox(this.spellcaster, x, y));
      }
      if(isType(x, y, 'barrier')) {
        state.destroyObject(this);
        return;
      }
    }
    if(frame % 5 === 0) {
      this.speed--;
    }
    this.timeout--;
    if(this.timeout <= 0) {
      state.destroyObject(this);
    }
  }
  render() {
    const { ctx, frame } = state;
    ctx.globalAlpha = this.timeout / this.maxTimeout;
    ctx.drawImage(
      this.img,
      this.cycle * SPRITE_WIDTH,
      0,
      SPRITE_WIDTH,
      SPRITE_HEIGHT,
      this.x,
      ctx.canvas.height - this.y - 64,
      SPRITE_WIDTH,
      SPRITE_HEIGHT
    );
    ctx.globalAlpha = 1;
    if(frame % 2 === 0) {
      this.cycle = (this.cycle + 1) % 3;
    }
  }
}

export default IceOrb;
