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
  getRadians,
} from '/client/utils/collisionUtils';
import {
  canMove,
} from '/client/utils/tileUtils';
import state from '/client/state/index';
import Arrow from '/client/objects/Arrow';
import Hero from './Hero';

class HeroArcher extends Hero {
  sprite = "archer";
  objectSprites = ['arrow'];
  speed = 6;
  rangeBox() {
    const yOffset = 20;
    const wideSwing = 15;
    if(this.direction === DIRECTIONS.RIGHT) {
      let x1 = this.x + (SPRITE_WIDTH / 2);
      let y1 = this.y;
      let x2 = x1 + this.xRange;
      let y2 = y1 + SPRITE_HEIGHT - yOffset;
      return [x1,y1,x2,y2];
    }
    if(this.direction === DIRECTIONS.LEFT) {
      let x1 = this.x + (SPRITE_WIDTH / 2);
      let y1 = this.y;
      let x2 = x1 - this.xRange;
      let y2 = y1 + SPRITE_HEIGHT - yOffset;
      return [x1,y1,x2,y2];
    }
    if(this.direction === DIRECTIONS.UP) {
      let x1 = this.x;
      let y1 = this.y + (SPRITE_HEIGHT / 2);
      let x2 = this.x + SPRITE_WIDTH + wideSwing;
      let y2 = y1 + this.yRange;
      return [x1,y1,x2,y2];
    }
    if(this.direction === DIRECTIONS.DOWN) {
      let x1 = this.x;
      let y1 = this.y + (SPRITE_HEIGHT - yOffset) / 2;
      let x2 = this.x + SPRITE_WIDTH + wideSwing;
      let y2 = y1 - this.yRange;
      return [x1,y1,x2,y2];
    }
  }
  handleAttack() {
    const { frame } = state;
    if(this.isAttacking) {
      if(this.cycle === 8 && frame % 3 === 1) {
        state.addObject(new Arrow(this, this.x, this.y, this.direction, this.objectImages[0]));
      }
      if(this.cycle === 12) {
        this.isAttacking = false;
      }
      else {
        if(frame % 3 === 0) {
          this.cycle++;
        }
        return;
      }
    }
  }
  update() {
    super.handleReel();
    super.handleEnemyCollision();
    this.handleAttack();
    if(!this.isAttacking) {
      super.handleMovement();
    }
  }
  render() {
    const { ctx } = state;
    if(this.reelX || this.reelY) {
      ctx.filter="saturate(15)";
    }
    const baseRow = this.isAttacking ? 16 : 8;
    ctx.drawImage(
      this.img,
      this.cycle * SPRITE_WIDTH,
      SPRITE_HEIGHT * (baseRow + this.direction),
      SPRITE_WIDTH,
      SPRITE_HEIGHT,
      this.x,
      ctx.canvas.height - this.y - SPRITE_HEIGHT,
      SPRITE_WIDTH,
      SPRITE_HEIGHT
    );
    ctx.filter="none";
    super.render();
  }
}

export default HeroArcher;
