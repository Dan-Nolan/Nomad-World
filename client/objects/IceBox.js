import {loadImage} from '/client/utils/loadImages';
import state from '/client/state/index';
import {
  DIRECTIONS
} from '/client/common';
import {
  canMove,
  outOfBounds,
} from '/client/utils/tileUtils';
import {
  collision,
  within,
  getRadians,
  getBox,
} from '/client/utils/collisionUtils';

const SPRITE_HEIGHT = 128;
const SPRITE_WIDTH = 128;

class Icebox {
  type = "IceBox";
  constructor(spellcaster, x, y) {
    this.spellcaster = spellcaster;
    this.x = Math.floor(x / 16) * 16;
    this.y = Math.floor(y / 16) * 16;
    this.melt = 75;
  }
  hitBox() {
    const width = 16;
    const height = 16;
    const x1 = this.x + width * 2;
    const y1 = this.y - height;
    const x2 = x1 + width;
    const y2 = this.y;
    return [x1,y1,x2,y2];
  }
  update() {
    const { frame, scene: { hero, enemies }} = state;
    this.melt--;
    const heroStandingOn = collision(hero.hitBox(), this.hitBox());
    const enemyStanding = enemies.some((enemy) => collision(enemy.hitBox(), this.hitBox()));
    if(!heroStandingOn && !enemyStanding && this.melt <= 0) {
      state.destroyObject(this);
    }
  }
  render() {
    const { layer1Ctx } = state;
    layer1Ctx.beginPath();
    layer1Ctx.fillStyle = 'rgba(255,255,255,.5)';
    layer1Ctx.fillRect(
      this.x + 16 * 2,
      layer1Ctx.canvas.height - this.y,
      16,
      16,
    );
    layer1Ctx.stroke();
  }
}

export default Icebox;
