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
import Hero from './Hero';

class Swordsman extends Hero {
  sprite ="hero";
  speed = 4;
  xRange = SPRITE_WIDTH * 1.2;
  yRange = SPRITE_HEIGHT * .6;
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
    const { scene: { enemies }} = state;
    if(this.isAttacking) {
      if(this.cycle === 4) {
        enemies.forEach((enemy) => {
          if(collision(this.rangeBox(), getBox(enemy))) {
            enemy.health -= 25;
            const radians = getRadians(this.rangeBox(), getBox(enemy));
            const magnitude = 30;
            enemy.aggro(this);
            enemy.reelX = magnitude * Math.cos(radians);
            enemy.reelY = magnitude * Math.sin(radians);
          }
        });
      }
      if(this.cycle === 5) {
        this.isAttacking = false;
      }
      else {
        this.cycle++;
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
    if(this.isAttacking) {
      ctx.drawImage(
        this.img,
        this.cycle * SPRITE_OVERSIZE_WIDTH,
        21 * SPRITE_HEIGHT + (this.direction * SPRITE_OVERSIZE_HEIGHT),
        SPRITE_OVERSIZE_WIDTH,
        SPRITE_OVERSIZE_HEIGHT,
        this.x - SPRITE_HEIGHT,
        ctx.canvas.height - this.y - (SPRITE_HEIGHT * 2),
        SPRITE_OVERSIZE_WIDTH,
        SPRITE_OVERSIZE_HEIGHT,
      );
    }
    else {
      ctx.drawImage(
        this.img,
        this.cycle * SPRITE_WIDTH,
        SPRITE_HEIGHT * (8 + this.direction),
        SPRITE_WIDTH,
        SPRITE_HEIGHT,
        this.x,
        ctx.canvas.height - this.y - SPRITE_HEIGHT,
        SPRITE_WIDTH,
        SPRITE_HEIGHT
      );
    }
    ctx.filter="none";
    super.render();
  }
}

export default Swordsman;
