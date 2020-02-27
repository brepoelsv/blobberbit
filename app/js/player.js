import SmoothAnimation from './smoothAnimation';
import vars from './variables';

export const playerConfig = {
  border: 6,
  textColor: '#FFFFFF',
  textBorder: '#888888',
  textBorderSize: 3,
  defaultSize: 30
};

export var player = new SmoothAnimation({
  id: -1,
  x: window.innerWidth / 2,
  y: window.innerHeight / 2,
  w: window.innerWidth,
  h: window.innerHeight
});
