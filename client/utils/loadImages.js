// looks as though globs only work on relative URLs:
// https://github.com/parcel-bundler/parcel/issues/3889
import images from '../images/*.png';

export function loadImages(sprites) {
  return Promise.all(sprites.map(loadImage));
}

export function loadImage(sprite) {
  return new Promise((resolve) => {
    const img = document.createElement('img');
    img.src = images[sprite];

    img.addEventListener('load', () => {
      resolve(img);
    });
  });
}
