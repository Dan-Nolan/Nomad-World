import map1 from '/client/assets/map1.json';
import tileset from '/client/assets/tileset.json';
import {loadImage} from '/client/utils/loadImages';
import PF from 'pathfinding';

const MAP_HEIGHT = map1.height;
const MAP_WIDTH = map1.width;
const TILESIZE = 16;
const PIXELS_HEIGHT = MAP_HEIGHT * TILESIZE;
const PIXELS_WIDTH = MAP_WIDTH * TILESIZE;
const walkable = new Array(MAP_WIDTH);
const tempWalkable = new Array(MAP_WIDTH);

export async function drawTileset(parent) {
  const tilebitmap = await loadImage('atlas_16x');
  for(let i = 0; i < MAP_WIDTH; i++) {
    walkable[i] = [];
    tempWalkable[i] = [];
  }
  for(let i = 0; i < map1.layers.length; i++) {
    const tileCanvas = document.createElement('canvas');
    tileCanvas.classList.add('tileset', `tileset-${i}`);
    tileCanvas.height = MAP_HEIGHT * TILESIZE;
    tileCanvas.width = MAP_WIDTH * TILESIZE;
    parent.appendChild(tileCanvas);
    const ctx = tileCanvas.getContext('2d');
    const layer = map1.layers[i];
    for(let row = 0; row < MAP_HEIGHT; row++) {
      for(let col = 0; col < MAP_WIDTH; col++) {
        const tile = layer.data[row * MAP_HEIGHT + col];

        const definition = tileset.tiles.find(x => x.id === tile-1);
        if(definition) {
          const canWalk = (definition.properties || []).find(x => x.name === "canWalk");
          walkable[row][col] = canWalk ? canWalk.value : true;
        } else if(walkable[row][col] === undefined) {
          walkable[row][col] = true;
        }

        const coords = { x: (tile%8)-1, y: Math.floor(tile / 8) }

        ctx.drawImage(
          tilebitmap,
          coords.x * TILESIZE, coords.y * TILESIZE,
          TILESIZE, TILESIZE,
          col * TILESIZE, row * TILESIZE,
          TILESIZE, TILESIZE
        );
      }
    }
  }
}

// debug method
export function drawWalkable(ctx) {
  for(let row = 0; row < MAP_HEIGHT; row++) {
    for (let col = 0; col < MAP_WIDTH; col++) {
      if(walkable[row][col] || tempWalkable[row][col]) {
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255,255,255,.5)';
        const x = col * TILESIZE;
        const y = row * TILESIZE;
        ctx.fillRect(x, y, TILESIZE, TILESIZE);
        ctx.stroke();
      }
    }
  }
}

export function findPath(x1, y1, x2, y2, allWalkable) {
  const grid = new PF.Grid(walkable.map((rowEls, row) => {
    return rowEls.map((el, col) => {
      if(allWalkable) return 0;
      return (el || tempWalkable[row][col]) ? 0 : 1;
    });
  }));
  const finder = new PF.AStarFinder();
  const col1 = Math.floor(x1 / TILESIZE) + 2;
  const row1 = Math.floor((PIXELS_HEIGHT - y1) / TILESIZE);
  const col2 = Math.floor(x2 / TILESIZE) + 2;
  const row2 = Math.floor((PIXELS_HEIGHT - y2) / TILESIZE);
  return finder.findPath(col1, row1, col2, row2, grid).map(([x,y]) => {
    return [x - 2, MAP_HEIGHT - y];
  })
}

export function outOfBounds(x, y) {
  return (x < -64 || y < -64 || x > PIXELS_WIDTH || y > PIXELS_HEIGHT);
}

export function revertWalkable(x, y) {
  const col = Math.floor(x / TILESIZE) + 2;
  const row = Math.floor((PIXELS_HEIGHT - y) / TILESIZE);
  delete tempWalkable[row][col];
}

export function getTile(x,y) {
  const col = Math.floor(x / TILESIZE) + 2;
  const row = Math.floor((PIXELS_HEIGHT - y) / TILESIZE);
  return [col, row];
}

export function tilesWithinBox([x1, y1, x2, y2]) {
  const xPoints = [];
  let xPoint = x1 - 32;
  xPoints.push(xPoint);
  while(xPoint < x2 - 32) {
    xPoint += TILESIZE;
    xPoints.push(xPoint);
  }

  const yPoints = [];
  let yPoint = y1;
  yPoints.push(yPoint);
  while(yPoint < y2) {
    yPoint += TILESIZE;
    yPoints.push(yPoint);
  }

  return xPoints.reduce((arr, x) => arr.concat(yPoints.map((y) => [x,y])), []);
}

export function isWater(x, y) {
  const [col, row] = getTile(x, y - 16);
  const definitions = map1.layers.map((layer) => {
    const tile = layer.data[row * MAP_HEIGHT + col];
    return tileset.tiles.find(x => x.id === tile-1);
  });
  return !definitions.filter(x => x).some(x => x.type !== "water");
}

export function isType(x, y, type) {
  const [col, row] = getTile(x, y - 16);
  const definitions = map1.layers.map((layer) => {
    const tile = layer.data[row * MAP_HEIGHT + col];
    return tileset.tiles.find(x => x.id === tile-1);
  });
  return definitions.filter(x => x).some(x => x.type === type);
}

export function getTileDefinition(x, y) {
  const [col, row] = getTile(x, y - 16);
  const firstLayer = map1.layers[0];
  const tile = firstLayer.data[row * MAP_HEIGHT + col];
  return tileset.tiles.find(x => x.id === tile-1);
}

export function makeWalkable(x, y) {
  const col = Math.floor(x / TILESIZE) + 2;
  const row = Math.floor((PIXELS_HEIGHT - y) / TILESIZE);
  tempWalkable[row][col] = true;
}

export function canMove(x, y) {
  const col = Math.floor(x / TILESIZE) + 2;
  const row = Math.floor((PIXELS_HEIGHT - y) / TILESIZE);
  if(row < 0 || col < 0 || !walkable[row]) {
    return false;
  }
  return tempWalkable[row][col] || walkable[row][col];
}
