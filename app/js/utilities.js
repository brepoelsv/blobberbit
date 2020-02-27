const hue2rgb = function hue2rgb(p, q, t) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
};

function hslToRgb(h, s, l) {
  let r;
  let g;
  let b;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    let q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    let p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function combineColor(c) {
  const [r, g, b] = c;
  return (r << 16) | (g << 8) | (b);
}

function checkImageSrcValid(src) {
  return (src.indexOf('.imgur.com/') > -1 &&
          (src.endsWith('.jpg') ||
           src.endsWith('.png') ||
           src.endsWith('.gif') ||
           src.endsWith('.jpeg'))
         );
}

function preprocessImageSrc(value = '') {
  if (value.startsWith('http://')) {
    return value.replace('http://', 'https://');
  } else if (value.startsWith('https://')) {
    return value;
  } else {
    return `https://${value}`;
  }
}

export {
  hslToRgb,
  combineColor,
  checkImageSrcValid,
  preprocessImageSrc
};
