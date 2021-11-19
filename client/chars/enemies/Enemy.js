import {
  SPRITE_HEIGHT,
  SPRITE_WIDTH,
  SPRITE_OVERSIZE_HEIGHT,
  SPRITE_OVERSIZE_WIDTH,
  DIRECTIONS
} from '/client/common';
import {
  collision,
  getBox,
  directionTo,
} from '/client/utils/collisionUtils';
import {
  canMove,
  findPath,
  isWater,
} from '/client/utils/tileUtils';
import state from '/client/state/index';

class Enemy {
  x = 0;
  y = 0;
  img = null;
  objectImages = [];
  isMoving = false;
  isAggro = false;
  vision = 150;
  totalHealth = 100;
  health = 100;
  peripheral = 100;
  freeze = 0;
  isAttacking = false;
  boxWidth = .5;
  heightOffset = 20;
  direction = DIRECTIONS.LEFT;
  cycle = 0;
  speed = 7;
  constructor(x, y, img) {
    this.x = x;
    this.y = y;
    this.img = img;
  }
  hitBox() {
    return getBox(this);
  }
  aggro(hero) {
  }
  visionBox() {
    const vision = this.isAggro ? this.vision*2 : this.vision;
    const peripheral = this.isAggro ? this.peripheral*2 : this.peripheral;
    if(this.direction === DIRECTIONS.RIGHT) {
      let x1 = this.x + SPRITE_WIDTH;
      let y1 = this.y - (peripheral / 2) + (SPRITE_WIDTH / 2);
      let x2 = x1 + vision;
      let y2 = y1 + peripheral;
      return [x1,y1,x2,y2];
    }
    if(this.direction === DIRECTIONS.LEFT) {
      let x1 = this.x;
      let y1 = this.y + (SPRITE_WIDTH / 2) + (peripheral / 2);
      let x2 = x1 - vision;
      let y2 = y1 - peripheral;
      return [x1,y1,x2,y2];
    }
    if(this.direction === DIRECTIONS.UP) {
      let x1 = this.x + (peripheral / 2) + (SPRITE_WIDTH / 2);
      let y1 = this.y + SPRITE_HEIGHT;
      let x2 = x1 - peripheral;
      let y2 = y1 + vision;
      return [x1,y1,x2,y2];
    }
    if(this.direction === DIRECTIONS.DOWN) {
      let x1 = this.x + (SPRITE_WIDTH / 2) + (peripheral / 2);
      let y1 = this.y;
      let x2 = x1 - peripheral;
      let y2 = y1 - vision;
      return [x1,y1,x2,y2];
    }
  }
  isFrozen() {
    return this.freeze > 0;
  }
  handleFreeze() {
    if(this.isFrozen()) {
      this.freeze--;
    }
  }
  isReeling() {
    return (this.reelX || this.reelY);
  }
  handleReel() {
    if(this.isReeling()) {
      const newY = this.y + this.reelY;
      const newX = this.x + this.reelX;
      this.reelX = Math.floor(this.reelX / 2);
      this.reelY = Math.floor(this.reelY / 2);
      if(Math.abs(this.reelX) <= 1) {
        this.reelX = 0;
      }
      if(Math.abs(this.reelY) <= 1) {
        this.reelY = 0;
      }
      if(!this.isReeling() && this.onEndReel) {
        this.onEndReel();
      }
      if(canMove(newX, newY)) {
        this.x = newX;
        this.y = newY;
      }
      else if(isWater(newX, newY)) {
        this.health = 0;
      }
    }
  }
}

export default Enemy;
