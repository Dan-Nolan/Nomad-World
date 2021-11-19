import {loadImage, loadImages} from '/client/utils/loadImages';
import {drawTileset, drawWalkable, makeWalkable, revertWalkable} from '/client/utils/tileUtils';
import {drawBox, getBox} from '/client/utils/collisionUtils';

class GameState {
  constructor(scene) {
    this.scene = scene;
    this.keyState = {}
    this.fps = 30;
    this.frame = 0;
    this.lastFrame = 0;
    this.canvas = document.getElementById("characters");
    this.ctx = this.canvas.getContext('2d');
    this.layer1Canvas = document.getElementById("layer-1");
    this.layer1Ctx = this.layer1Canvas.getContext('2d');

    document.addEventListener("keydown", (event) => {
      this.keyState[event.code] = true;
    });

    document.addEventListener("keyup", (event) => {
      this.keyState[event.code] = false;
    });
  }
  async initialize() {
    const { hero } = this.scene;
    hero.img = await loadImage(hero.sprite);
    if(hero.objectSprites) {
      hero.objectImages = await loadImages(hero.objectSprites);
    }
    for(let i = 0; i < this.scene.enemies.length; i++) {
      const enemy = this.scene.enemies[i];
      enemy.img = await loadImage(enemy.sprite);
      if(enemy.objectSprites) {
        enemy.objectImages = await loadImages(enemy.objectSprites);
      }
    }

    const parent = document.getElementById("game");
    await drawTileset(parent);

    this.loop();
  }
  addObject(object) {
    this.scene.objects.push(object);
  }
  destroyObject(object) {
    const idx = this.scene.objects.findIndex(o => o === object);
    this.scene.objects.splice(idx, 1);
  }
  destroyEnemy(enemy) {
    const idx = this.scene.enemies.findIndex(e => e === enemy);
    this.scene.enemies.splice(idx, 1);
  }
  loop() {
    window.requestAnimationFrame((timestamp) => {
      if(!this.start) this.start = timestamp;
      const elapsed = timestamp - this.start;
      this.frame = Math.floor(elapsed / (1000 / 30));
      if(this.frame === this.lastFrame) {
        this.loop();
        return;
      }
      this.lastFrame = this.frame;

      const cachedBoxes = this.scene.objects.filter((object) => {
        return object.type === "IceBox";
      })
      cachedBoxes.forEach(({x,y}) => {
        makeWalkable(x, y);
      });

      this.scene.hero.update();
      this.scene.enemies.forEach(enemy => enemy.update());
      this.scene.objects.forEach(object => object.update());

      this.layer1Ctx.clearRect(0, 0, this.layer1Canvas.width, this.layer1Canvas.height);
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.scene.hero.render();
      this.scene.enemies.forEach(enemy => enemy.render());
      this.scene.objects.forEach(object => object.render());

      this.scene.adjustCamera();

      // drawWalkable(this.ctx);
      // this.scene.objects.forEach(object => drawBox(this.ctx, object.hitBox()));

      cachedBoxes.forEach(({x,y}) => {
        revertWalkable(x, y);
      });

      this.loop();
    });
  }
}

export default GameState;
