import HeroArcher from '/client/chars/heroes/HeroArcher';
import Swordsman from '/client/chars/heroes/Swordsman';
import Skele from '/client/chars/enemies/Skele';
import Archer from '/client/chars/enemies/Archer';
import Bat from '/client/chars/enemies/Bat';
import Sword from '/client/objects/Sword';
import map1 from '/client/assets/map1.json';

const cameraElement = document.getElementById("game");
const viewport = document.getElementById("viewport");
const canvas = document.getElementById("characters");

const heroSpawn = {
  // x: 1095, // test coords
  // y: 800 
  x: 1130,
  y: 50
}

class Scene {
  constructor() {
    this.map = map1;
    this.mapPixelHeight = map1.height * 16;
    this.mapPixelWidth = map1.width * 16;

    document.getElementById("characters").height = this.mapPixelHeight;
    document.getElementById("characters").width = this.mapPixelWidth;
    document.getElementById("layer-1").height = this.mapPixelHeight;
    document.getElementById("layer-1").width = this.mapPixelWidth;

    this.enemies = [];
    this.enemies.push(new Skele(1152, 400));
    this.enemies.push(new Skele(1052, 620));
    this.enemies.push(new Skele(1152, 620));
    this.enemies.push(new Skele(1252, 520));
    this.enemies.push(new Bat(1175, 200));
    this.enemies.push(new Bat(1190, 250));
    this.enemies.push(new Archer(1352, 250));
    this.enemies.push(new Archer(1425, 400));
    this.enemies.push(new Archer(750, 400));
    this.objects = [];
    this.objects.push(new Sword(1095, 900));
  }
  initializeHero(type) {
    if (type === 0) {
      this.hero = new Swordsman(heroSpawn.x, heroSpawn.y);
    }
    else {
      this.hero = new HeroArcher(heroSpawn.x, heroSpawn.y);
    }
    this.adjustCamera();
  }
  adjustCamera() {
    let top = -(canvas.height - viewport.offsetHeight - this.hero.y) - 200;
    // absolute top bounds check
    top = Math.min(top, 0);
    // absolute bottom bounds check
    // top = Math.max(top, cameraElement.offsetHeight - canvas.height);

    let left = 400 - this.hero.x;
    // absolute right bounds check
    left = Math.min(left, 0);
    // absolute left bounds check
    left = Math.min(left, canvas.width - viewport.offsetHeight);

    this.camera = { top, left }
    game.style.top = this.camera.top;
    game.style.left = this.camera.left;
  }
}

export default Scene;
