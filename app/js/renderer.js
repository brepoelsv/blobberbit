import 'pixi.js';
import 'pixi-display';
import { getTexture } from '../assets';
// import './pixi-cocoontext';
import backgroundImage from '../img/background.png';
import backgroundImage2 from '../img/background2.png';
import { getTheme } from './toggleDarkMode';

// const getTexture = () => 0
// PIXI.cocoontext.CONST.TEXT_RESOLUTION = 1
const afactor = 0.5;
const textuteCache = {};

const ObjectGroup = new PIXI.DisplayGroup(1, true);
const TextGroup = new PIXI.DisplayGroup(2, false);


const LightGroundTexture = new PIXI.Texture.fromImage(backgroundImage);
const DarkGroundTexture = new PIXI.Texture.fromImage(backgroundImage2);

export default class Rendered {
  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    this.canvas = canvas;
    //var stage = new PIXI.stage(0xff00ff);
    this.renderer = PIXI.autoDetectRenderer(innerWidth, innerHeight, {
      view: canvas,
      transparent: true,
      antialias: false
    });
    this.container = new PIXI.Container();
    this.stage = new PIXI.Container();
    this.graph = new PIXI.Graphics();
    this.graphInfo = new PIXI.Graphics();
    this.ground = new PIXI.extras.TilingSprite(LightGroundTexture);
    this.ground.uvRespectAnchor = true;
    this.ground.anchor.set(0.5,0.5);
    this.container.addChild(this.ground);
    //this.container.addChild(this.graph);
    this.container.addChild(this.stage);
    this.container.addChild(this.graphInfo);
    this.stage.displayList = new PIXI.DisplayList();
    this._sprite = this.graphInfo;
    this.zoom = 1;
    this.render();
  }
  setText(...args) {
    SpriteProxyPrototype.setText.bind(this)(...args);
    for (let i in this) {
      if (i.startsWith('_text@') && this[i]) {
        const textSprite = this[i];
        //textSprite.cacheAsBitmap = true;
        textSprite.scale.set(1);
        textSprite.resolution = 1;
        textSprite.position.x = this.renderer.width / 2;
        textSprite.position.y = this.renderer.height / 2;
      }
    }
  }
  render() {
    this._updateZoom(afactor);
    this.renderer.render(this.container);
  }

  static createSpriteFromeImage(src) {
    if (!textuteCache[src]) {
      const tmp = getTexture(src);
      if (tmp instanceof PIXI.Texture) {
        // console.log('MATCH SPRITE ' ,src)
        textuteCache[src] = tmp;
        return new PIXI.Sprite(tmp);
      } else if (tmp instanceof Promise) {
        // console.log('MATCH ASYNC SPRITE ' ,src)

        const sprite = new PIXI.Sprite();
        tmp.then(e => (textuteCache[src] = sprite.texture = e));
        return sprite;
      } else {
        // console.warn('MISSING SPRITE ALTATS:' +src)

        textuteCache[src] = PIXI.Texture.fromImage(src);
        return new PIXI.Sprite(textuteCache[src]);
      }
    } else {
      return new PIXI.Sprite(textuteCache[src]);
    }
  }

  set scale(value) {
    this._scale = value;
    this.stage.scale.set(this._scale);
  }

  get scale() {
    return this._scale;
  }

  set zoom(zoom) {
    if (this._zoom === undefined) {
      this.__zoom = this.___zoom = zoom;
    }
    this._zoom = zoom;
  }
  get zoom() {
    return this.___zoom || 1;
  }
  updateSkin() {
    const theme = getTheme();
    this.ground.texture = {
      'light': LightGroundTexture,
      'dark': DarkGroundTexture,
    }[theme];
  }

  _updateZoom(afactor) {
    this.___zoom += (this.__zoom - this.___zoom) * afactor;
    this.__zoom += (this._zoom - this.__zoom) * afactor;

    const zoom = this.zoom || 1;

    this.container.scale.set(zoom);
    this.container.position.set(
      this.renderer.width * (1 - zoom) * afactor,
      this.renderer.height * (1 - zoom) * afactor
    );
    this.ground.width = this.renderer.width / zoom;
    this.ground.height = this.renderer.height / zoom;
    this.ground.position.set(
      this.renderer.width * afactor,
      this.renderer.height * afactor
    );
   //console.log("Zoom : ", zoom, "_Zoom :", this._zoom, "__Zoom : ", this.___zoom, "Scale :",this._scale)
  }

  // Wrapper approach
  resizeMe(width, height)
  {
    this.renderer.resize(width, height);
  }
}

const SpriteProxyPrototype = {
  render(x, y, width, height, property = '_spriteImage') {
    this._sprite.position.set(x, y);
    this._sprite.zOrder = -width - height;
    // this._spriteImage.zOrder = -width - height
    if (this._spriteImage.width !== width || this._spriteImage.height !== height) {
      // console.log('setWidthHeight Run')
      this._spriteImage.width = width;
      this._spriteImage.height = height;
      if (this._maskSprite) {
        this._maskSprite.width = width;
        this._maskSprite.height = height;
      }
    }
  },
  setSrc(src, property = '_spriteImage') {
    if (!textuteCache[src]) {
      const tmp = getTexture(src);
      if (tmp instanceof PIXI.Texture) {
        // console.log('MATCH SPRITE ' ,src)
        textuteCache[src] = tmp;
        this[property].texture = tmp;
      } else if (tmp instanceof Promise) {
        // console.log('MATCH ASYNC SPRITE ' ,src)
        tmp.then(e => (textuteCache[src] = this[property].texture  = e));
      } else {
        // console.warn('MISSING SPRITE ALTATS:' +src)
        this[property].texture = textuteCache[src] = PIXI.Texture.fromImage(src);
      }
    } else if (this[property].texture !== textuteCache[src]) {
      this[property].texture = textuteCache[src];
      // console.log('setSrc Run')
    }
  },
  setText(text, key, {
    fontFamily = 'Ubuntu',
	  fontSize = '20px',
	  fontWeight = 'bold',
  //  font = 'bold 20px Ubuntu',
    fill = '#ffffff',
    align = 'center',
    stroke = '#888888',
    thin = 2,
    x = 0,
    y = 0,
  } = {}) {
    const scale = (this._stage || this.stage).scale.x;
    const sym = `_text@${key}`;
    const textStyle = {
      fontFamily,
	    fontSize,
	    fontWeight,
      fill,
      align,
      stroke,
      strokeThickness: thin,
      x,
      y
    };
    if (!text) {
      if (this[sym]) {
        //console.log(this[sym]);
        this._sprite && this._sprite.removeChild(this[sym]);
        this[sym] = null;
      }
    } else if (!this[sym]) {
      //updateText()
      const textSprite = new PIXI.Text(text, textStyle);
     // textSprite.cacheAsBitmap = true;

		 //console.log(text);
      // var textSprite = new  PIXI.Text(text, textStyle);
      textSprite.resolution = scale *  2;
      textSprite.anchor.set(0.5, 0.5);
      // textSprite.displayGroup = TextGroup;
      textSprite.position.set(x, y);
      this[sym] = textSprite;
      textSprite.scale.set(1 / scale);
      this._sprite && this._sprite.addChild(textSprite);
	  // console.log(this._sprite && this._sprite.addChild(textSprite));
    } else {
      const textSprite = this[sym];
      let changeStyle = false;
      if (textSprite.text !== text) {
        textSprite.text = text;
       // console.log(textSprite.text);
      }
      textSprite.position.set(x, y);
      for (const i in textStyle) {
        changeStyle = changeStyle || (textStyle[i] !== textSprite.style[i]);
      }

      textSprite.style = textStyle;

      textSprite.scale.set(1 / scale);
      textSprite.resolution = scale * 2;
    }
  },
  setMask(src) {
    if (src === '') {
      this._sprite.removeChild(this._maskSprite);
      this._spriteImage.mask = null;
      this._maskSprite = null;
    } else if (!this._maskSprite) {
      this._maskSprite = Rendered.createSpriteFromeImage(src);
      this._maskSprite.anchor.set(0.5);
      this._sprite.addChildAt(this._maskSprite, 0);
      this._spriteImage.mask = this._maskSprite;
      // console.log('set mask done',this._maskSprite)
    } else {
      this.setSrc(src, '_maskSprite');
    }
  }
};

export function onDel(e) {
  if (e && e.cells && Object.keys(e.cells).length) {

    //for (const i in e.cells) {  old VO
    //  onDel(e.cells[i]);        old Vo
    for (const i in e) {
     // console.log(e.cells[i]);
      onDel(e);
    }
  }
  if (e) {
    //e._stage && e._sprite && e._stage.removeChild(e._sprite)
    e._stage && e._sprite && e._stage.removeChild(e._sprite);
    e._sprite = null;
    e._spriteImage = null;
    e.text = null;
    e.textSprite = null;
    e._text=null;
    e.textStyle = null;
    e._maskSprite = null;
    e.mass = null;
    e.name = null;
    //console.log(e);
    //debugger;

    //destroyTexture();

  }
}

/**
 * @param {PIXI.Container} stage
 * @param {String} imageSrc
 */
export function SpriteProxy(stage, imageSrc = '') {
  return {
    onNew(e) {
      const sprite = new PIXI.Sprite();
      const imageSprite =  Rendered.createSpriteFromeImage((e.sprite + '').endsWith('.png') ? e.sprite : imageSrc);
      imageSprite.anchor.set(0.5, 0.5);
      sprite.addChild(imageSprite);
      stage.addChild(sprite);
      for (const i in SpriteProxyPrototype) {
        e[i] = SpriteProxyPrototype[i].bind(e);
      }
      e._stage = stage;
      e._sprite = sprite;
      e._spriteImage = imageSprite;
      e._sprite.displayGroup = ObjectGroup;
    },
    onDel(e) {
      onDel(e);
    },
    onChange(e) {}
  };
}
