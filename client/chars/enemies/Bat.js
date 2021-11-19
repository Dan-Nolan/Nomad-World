import {
  DIRECTIONS
} from '/client/common';
import {
  collision,
  getBox,
  directionTo,
} from '/client/utils/collisionUtils';
import {
  findPath,
  outOfBounds,
} from '/client/utils/tileUtils';
import state from '/client/state/index';
import Enemy from './Enemy';

const SPRITE_WIDTH = 32;
const SPRITE_HEIGHT = 32;

class Bat extends Enemy {
  sprite = "bat";
  vision = 200;
  totalHealth = 25;
  health = 25;
  peripheral = 150;
  isAggro = false;
  speed = 7;
  visionBox() {
    const vision = this.isCharging ? this.vision*2 : this.vision;
    const peripheral = this.isCharging ? this.peripheral*2 : this.peripheral;
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
    this.setPath(hero);
  }
  setPath(hero) {
    this.path = findPath(this.x, this.y, hero.x, hero.y, true);
    this.pathIndex = 0;
  }
  update() {
    const { frame, scene: { hero }} = state;
    if(this.health <= 0) {
      state.destroyEnemy(this);
      return;
    }
    if(frame % 8 === 0) {
      this.cycle = ++this.cycle % 3;
    }
    if(frame % 24 === 0) {
      if(!this.charging) {
        if(this.isMoving) {
          this.isMoving = false;
          this.cycle = 0;
        }
        else {
          this.isMoving = true;
          this.direction = Math.floor(Math.random() * 4);
          this.cycle = 0;
        }
      }
    }
    if(this.isFrozen()) {
      this.handleFreeze();
      return;
    }
    if(this.isReeling()) {
      this.handleReel();
      return;
    }
    if(collision(this.visionBox(), getBox(hero))) {
      this.isAggro = true;
    }
    if(this.isAggro) {
      const speedBoost = 1.5;
      if(frame % 6 === 0) {
        this.cycle = ++this.cycle % 3;
        if(!this.path) {
          this.setPath(hero);
          return;
        }
        const next = this.path[this.pathIndex];
        if(!next) {
          this.setPath(hero);
          return;
        }
        let newX = next[0] * 16;
        let newY = next[1] * 16;
        this.pathIndex++;
        if(newX < this.x) this.direction = DIRECTIONS.LEFT;
        if(newX > this.x) this.direction = DIRECTIONS.RIGHT;
        if(newY < this.y) this.direction = DIRECTIONS.DOWN;
        if(newY > this.y) this.direction = DIRECTIONS.UP;
        if(!outOfBounds(newX, newY)) {
          this.x = newX;
          this.y = newY;
        }
      }
      if(frame % 10 === 0) {
        this.setPath(hero);
        return;
      }
    }
    else if(this.isMoving) {
      if(frame % 4 === 0) {
        let newX = this.x;
        let newY = this.y;
        if(this.direction === 0) {
          this.direction = DIRECTIONS.UP;
          this.cycle = ++this.cycle % 8;
          newY += this.speed;
        }
        else if(this.direction === 1) {
          this.direction = DIRECTIONS.LEFT;
          this.cycle = ++this.cycle % 8;
          newX -= this.speed;
        }
        else if(this.direction === 2) {
          this.direction = DIRECTIONS.DOWN;
          this.cycle = ++this.cycle % 8;
          newY -= this.speed;
        }
        else if(this.direction === 3) {
          this.direction = DIRECTIONS.RIGHT;
          this.cycle = ++this.cycle % 8;
          newX += this.speed;
        }
        if(!outOfBounds(newX, newY)) {
          this.x = newX;
          this.y = newY;
        }
      }
    }
  }
  render() {
    const { ctx } = state;
    if(this.health <= 0) {
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
    const translatedDirection = {
      [DIRECTIONS.DOWN]: 0,
      [DIRECTIONS.RIGHT]: 1,
      [DIRECTIONS.UP]: 2,
      [DIRECTIONS.LEFT]: 3
    }
    ctx.drawImage(
      this.img,
      (this.cycle + 1) * SPRITE_WIDTH,
      SPRITE_HEIGHT * translatedDirection[this.direction],
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

export default Bat;
