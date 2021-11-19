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
  getTileDefinition,
} from '/client/utils/tileUtils';
import state from '/client/state/index';
import IceOrb from '/client/objects/IceOrb';
import Hero from './Hero';

class Spellcaster extends Hero {
  sprite = "spellcaster";
  objectSprites = ['orbs'];
  speed = 3;
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
  makeIceOrb(x, y, direction) {
    state.addObject(new IceOrb(this, x, y, direction, this.objectImages[0]));
  }
  handleAttack() {
    const { frame } = state;
    if(this.isAttacking) {
      if(frame % 3 === 1) {
        if(this.cycle === 2) {
          if(this.direction === DIRECTIONS.LEFT) {
            this.makeIceOrb(this.x, this.y - 16, DIRECTIONS.LEFT);
          }
          if(this.direction === DIRECTIONS.RIGHT) {
            this.makeIceOrb(this.x, this.y - 16, DIRECTIONS.RIGHT);
          }
          if(this.direction === DIRECTIONS.UP) {
            this.makeIceOrb(this.x - 8, this.y - 8, DIRECTIONS.UP);
          }
          if(this.direction === DIRECTIONS.DOWN) {
            this.makeIceOrb(this.x - 8, this.y - 8, DIRECTIONS.DOWN);
          }
        }
      }
      if(this.cycle === 5) {
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
    const baseRow = this.isAttacking ? 12 : 8;
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

export default Spellcaster;
