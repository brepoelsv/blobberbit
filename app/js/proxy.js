import {
  SpriteProxy
} from './renderer';

import {
  virusImage,
  glueImage,
  shieldImage,
  bombImage,
  drunkImage,
  megaImage,
  shootImage,
  x2Image,
  x5Image,
  extra1Image,
  extra2Image,
  extra3Image,
  extra4Image,
  extra5Image,
  freezeImage,
  speedImage,
  foodImage
} from './objectImages';

import {
  renderer
} from './dom.js';

export const spritesProxy = new SpriteProxy(renderer.stage);
export const foodsSprites = new SpriteProxy(renderer.stage, foodImage);
export const virusesSprites = new SpriteProxy(renderer.stage, virusImage);
export const glueSprites = new SpriteProxy(renderer.stage, glueImage);
export const bombSprites = new SpriteProxy(renderer.stage, bombImage);
export const drunkSprites = new SpriteProxy(renderer.stage, drunkImage);
export const shootSprites = new SpriteProxy(renderer.stage, shootImage);
export const x5Sprites = new SpriteProxy(renderer.stage, x5Image);
export const extra1Sprites = new SpriteProxy(renderer.stage, extra1Image);
export const extra2Sprites = new SpriteProxy(renderer.stage, extra2Image);
export const extra3Sprites = new SpriteProxy(renderer.stage, extra3Image);
export const extra4Sprites = new SpriteProxy(renderer.stage, extra4Image);
export const extra5Sprites = new SpriteProxy(renderer.stage, extra5Image);
export const freezeSprites = new SpriteProxy(renderer.stage, freezeImage);
export const speedSprites = new SpriteProxy(renderer.stage, speedImage);
export const userCellSprites = new SpriteProxy(renderer.stage);
export const shieldSprite = new SpriteProxy(renderer.stage, shieldImage);
export const x2Sprites = new SpriteProxy(renderer.stage, x2Image);
export const megaSprites = new SpriteProxy(renderer.stage, megaImage);
export const bulletSprites = new SpriteProxy(renderer.stage, bombImage);
