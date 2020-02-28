import 'pixi.js';
import '!!file?name=[path][name].[ext]!./sprite.png';
import spritesheet from './sprite.json';
import spritesheetURL from '!!file?name=[path][name].[ext]!./sprite.json';

let textures = {};

PIXI.utils.skipHello();

const loadPromise = new Promise(resolve => {
  PIXI.loader.add('sheet', spritesheetURL, {
    xhrType: 'json'
  }).load((loader, resources) => {
    textures = resources.sheet.textures;
    resolve(resources.sheet.textures);
  });
});

const getTexture = (path) => {
  const key = path.split('/').pop();
  return textures[key] ||
    (spritesheet[key] && loadPromise.then(() => Promise.resolve(textures[key]) )) ||
    null;
};

export {
  getTexture
};
