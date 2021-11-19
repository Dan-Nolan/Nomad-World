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

class Hero {
  x = 0;
  y = 0;
  isHero = true;
  img = null;
  isMoving = false;
  isAttacking = false;
  boxWidth = .4;
  yWalkOffset = 5;
  heightOffset = 25;
  direction = DIRECTIONS.UP;
  objectImages = [];
  health = 100;
  totalHealth = 100;
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
  handleReel() {
    if(this.reelX || this.reelY) {
      if(canMove(this.x, this.y + this.reelY)) {
        this.y += this.reelY;
      }
      if(canMove(this.x - this.reelX, this.y)) {
        this.x -= this.reelX;
      }
      this.reelX = Math.floor(this.reelX / 2);
      this.reelY = Math.floor(this.reelY / 2);
      if(Math.abs(this.reelX) <= 1) {
        this.reelX = 0;
      }
      if(Math.abs(this.reelY) <= 1) {
        this.reelY = 0;
      }
    }
  }
  render() {
    this.drawHealthBar();
  }
  drawHealthBar() {
    const { layer1Ctx } = state;

    const borderThickness = 2;
    const x = 10;
    const y = 10;
    const width = 125;
    const height = 20;

    layer1Ctx.beginPath();
    layer1Ctx.fillStyle = 'rgba(0,0,0,1)';
    layer1Ctx.fillRect(
      x - borderThickness,
      y - borderThickness,
      width + borderThickness * 2,
      height + borderThickness * 2
    );
    layer1Ctx.stroke();

    layer1Ctx.fillStyle = 'red';
    layer1Ctx.fillRect(x, y, width, height);
    layer1Ctx.stroke();

    layer1Ctx.fillStyle = "green";
    layer1Ctx.fillRect(x, y, width * (this.health / this.totalHealth), height);
    layer1Ctx.stroke();
  }
  takeDamage(power) {
    this.health -= power;
  }
  handleEnemyCollision() {
    if(this.reelX || this.reelY) return;
    const { scene: { enemies }} = state;
    enemies.forEach((enemy) => {
      if(collision(getBox(this), getBox(enemy))) {
        this.takeDamage(25);
        const radians = getRadians(getBox(enemy), getBox(this));
        const magnitude = 40;
        this.reelX = magnitude * Math.cos(radians);
        this.reelY = magnitude * Math.sin(radians);
      }
    });
  }
  handleMovement() {
    const { keyState } = state;
    let newX = this.x;
    let newY = this.y;
    if(keyState["Space"]) {
      this.isAttacking = true;
      this.cycle = 0;
    }
    else if(keyState["ArrowDown"]) {
      this.direction = DIRECTIONS.DOWN;
      this.isMoving = true;
      this.cycle = ++this.cycle % 8;
      newY -= this.speed;
    }
    else if(keyState["ArrowUp"]) {
      this.direction = DIRECTIONS.UP;
      this.isMoving = true;
      this.cycle = ++this.cycle % 8;
      newY += this.speed;
    }
    else if(keyState["ArrowLeft"]) {
      this.direction = DIRECTIONS.LEFT;
      this.isMoving = true;
      this.cycle = ++this.cycle % 8;
      newX -= this.speed;
    }
    else if(keyState["ArrowRight"]) {
      this.direction = DIRECTIONS.RIGHT;
      this.isMoving = true;
      this.cycle = ++this.cycle % 8;
      newX += this.speed;
    }
    else {
      this.isMoving = false;
      this.cycle = 0;
    }
    if((newX !== this.x || newY !== this.y) && canMove(newX, newY + this.yWalkOffset)) {
      this.x = newX;
      this.y = newY;
    }
  }
}

export default Hero;
