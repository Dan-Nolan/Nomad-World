import {
  SPRITE_HEIGHT,
  SPRITE_WIDTH,
  DIRECTIONS
} from '/client/common';
import {
  collision,
  getBox,
  directionTo,
} from '/client/utils/collisionUtils';
import {
  canMove,
} from '/client/utils/tileUtils';
import state from '/client/state/index';
import Arrow from '/client/objects/Arrow';
import Enemy from './Enemy';

class Archer extends Enemy {
  sprite = "orc-archer";
  objectSprites = ['arrow'];
  vision = 250;
  totalHealth = 100;
  health = 100;
  peripheral = 100;
  yWalkOffset = 10;
  speed = 8;
  visionBox(attemptShot) {
    const vision = attemptShot ? this.vision*2 : this.vision;
    const peripheral = attemptShot ? 25 : this.peripheral;
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
  aggro(hero) {
    this.isAggro = true;
  }
  update() {
    const { frame, scene: { hero }} = state;
    if(this.health === 0) {
      state.destroyEnemy(this);
      return;
    }
    if(this.isReeling()) {
      this.handleReel();
      return;
    }
    if(this.isFrozen()) {
      this.handleFreeze();
      return;
    }
    if(collision(this.visionBox(), getBox(hero))) {
      this.isAggro = true;
    }
    if(this.isAggro) {
      this.direction = directionTo(getBox(this), getBox(hero));
      if(this.isAttacking) {
        if(frame % 4 === 0) {
          this.cycle++;
          if(this.cycle === 8) {
            state.addObject(new Arrow(this, this.x, this.y, this.direction, this.objectImages[0]));
          }
        }
        if(this.cycle === 13) {
          this.cycle = 0;
          this.isAttacking = false;
        }
      }
      else if(collision(this.visionBox(true), getBox(hero))) {
        this.isAttacking = true;
      }
      else if(frame % 8 === 0){
        let newX = this.x;
        let newY = this.y;
        if(this.direction === DIRECTIONS.LEFT || this.direction === DIRECTIONS.RIGHT) {
          if(hero.y < this.y) {
            newY -= this.speed;
          }
          if(hero.y > this.y) {
            newY += this.speed;
          }
        }
        if(this.direction === DIRECTIONS.UP || this.direction === DIRECTIONS.DOWN) {
          if(hero.x < this.x) {
            newX -= this.speed;
          }
          if(hero.x > this.x) {
            newX += this.speed;
          }
        }
        if(canMove(newX, newY + this.yWalkOffset)) {
          this.x = newX;
          this.y = newY;
        }
      }
    }
  }
  render() {
    const { ctx } = state;
    if(this.health === 0) {
      return;
    }
    if(this.isReeling()) {
      ctx.filter="saturate(15)";
    }
    if(this.isFrozen()) {
      ctx.filter="grayscale(50)";
    }
    if(this.health) {
      const barHeight = 10;
      ctx.beginPath();
      let x1 = this.x;
      let y1 = ctx.canvas.height - this.y - SPRITE_HEIGHT - barHeight;
      let x2 = x1 + SPRITE_WIDTH;
      ctx.rect(x1, y1, x2-x1, barHeight);
      ctx.fillStyle = "red";
      ctx.fill();

      ctx.beginPath();
      x1 = this.x;
      y1 = ctx.canvas.height - this.y - SPRITE_HEIGHT - barHeight;
      ctx.rect(x1, y1, SPRITE_WIDTH * (this.health / this.totalHealth), barHeight);
      ctx.fillStyle = "green";
      ctx.fill();
    }
    ctx.drawImage(
      this.img,
      this.cycle * SPRITE_WIDTH,
      SPRITE_HEIGHT * (16 + this.direction),
      SPRITE_WIDTH,
      SPRITE_HEIGHT,
      this.x,
      ctx.canvas.height - this.y - SPRITE_HEIGHT,
      SPRITE_WIDTH,
      SPRITE_HEIGHT
    );
    ctx.filter="none";
  }
}

export default Archer;
