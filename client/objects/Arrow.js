import {loadImage} from '/client/utils/loadImages';
import state from '/client/state/index';
import {
  DIRECTIONS
} from '/client/common';
import {
  canMove,
  outOfBounds,
  tilesWithinBox,
  isType,
} from '/client/utils/tileUtils';
import {
  collision,
  getRadians,
  getBox,
} from '/client/utils/collisionUtils';

const SPRITE_HEIGHT = 128;
const SPRITE_WIDTH = 128;

class Arrow {
  constructor(archer, x, y, direction, img) {
    this.archer = archer;
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.img = img;
    this.speed = 10;
  }
  hitBox() {
    if(this.direction === DIRECTIONS.LEFT || this.direction === DIRECTIONS.RIGHT) {
      const width = 40;
      const height = 10;
      const x1 = this.x + (64/2) - (width/2);
      const y1 = this.y + (64/2) - (height/2);
      const x2 = x1 + width;
      const y2 = y1 + height;
      return [x1,y1,x2,y2];
    }
    else {
      const width = 10;
      const height = 40;
      const x1 = this.x + (64/2) - (width/2);
      const y1 = this.y + (64/2) - (height/2);
      const x2 = x1 + width;
      const y2 = y1 + height;
      return [x1,y1,x2,y2];
    }
  }
  update() {
    const { frame, scene: { hero, enemies }} = state;
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
    const hitBoxTiles = tilesWithinBox(this.hitBox());
    for(let i = 0; i < hitBoxTiles.length; i++) {
      const [x,y] = hitBoxTiles[i];
      if(isType(x, y, 'barrier')) {
        state.destroyObject(this);
        return;
      }
    }
    if(hero !== this.archer) {
      if(collision(this.hitBox(), getBox(hero))) {
        hero.takeDamage(10);
        const radians = getRadians(this.hitBox(), getBox(hero));
        const magnitude = 3;
        hero.reelX = magnitude * Math.cos(radians);
        hero.reelY = magnitude * Math.sin(radians);
        state.destroyObject(this);
      }
    }
    enemies.forEach((enemy) => {
      if(enemy === this.archer) return;
      if(collision(this.hitBox(), getBox(enemy))) {
        enemy.health -= 25;
        const radians = getRadians(this.hitBox(), getBox(enemy));
        const magnitude = 5;
        enemy.reelX = magnitude * Math.cos(radians);
        enemy.reelY = magnitude * Math.sin(radians);
        state.destroyObject(this);
        if(this.archer.isHero) {
          enemy.aggro(hero);
        }
      }
    });
    if(outOfBounds(this.x, this.y)) {
      state.destroyObject(this);
    }
  }
  render() {
    const { ctx } = state;
    ctx.drawImage(
      this.img,
      this.direction * SPRITE_WIDTH,
      0,
      SPRITE_WIDTH,
      SPRITE_HEIGHT,
      this.x,
      ctx.canvas.height - this.y - 64,
      64,
      64
    );
  }
}

export default Arrow;
