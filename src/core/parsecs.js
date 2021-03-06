
var requestAnimFrame = (function(callback) {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
  function(callback) {
    window.setTimeout(callback, 1000 / 60);
  };
})();

var util = require("util");
var events = require("events");

function Parsecs(width, height, domElement) {
  events.EventEmitter.call(this);

  this.lastTime = 0;
  this.timeCount = 0;
  this.oldMousePos = { x: 0, y: 0 };

  // create an new instance of a pixi stage
  this.stage = new PIXI.Stage(0xFFFFFF);

  // this.stage.setInteractive(true);

  this.renderer = PIXI.autoDetectRenderer(width, height, domElement, false, true);

  /*
  this.canvas.addEventListener("mousedown", this.mouseDownListener.bind(this), false);
  this.canvas.addEventListener("mouseup", this.mouseUpListener.bind(this), false);
  this.canvas.addEventListener("mousemove", this.mouseMoveListener.bind(this), false);
  this.canvas.addEventListener("mousewheel", this.mouseWheelListener.bind(this), false);
  */
  this.world = new Parsecs.World();
  this.camera = new Parsecs.Camera();

  this.superLayer = new PIXI.DisplayObjectContainer();
  this.stage.addChild(this.superLayer);

  this.graphics = new PIXI.Graphics();
  this.superLayer.addChild(this.graphics);

  this.backgroundLayer = new PIXI.Graphics();
  this.backgroundLayer.setInteractive(true);
  this.backgroundLayer.hitArea = new PIXI.Rectangle(0, 0, 1000000, 1000000);
  this.superLayer.addChild(this.backgroundLayer);

  this.layer = new PIXI.DisplayObjectContainer();
  this.layer.setInteractive(true);
  this.superLayer.addChild(this.layer);

  this.backgroundLayer.click = this.backgroundLayer.tap = this.mouseDownListener.bind(this);
  this.stage.mousewheel = this.mouseWheelListener.bind(this);
  this.stage.mousemove = this.mouseMoveListener.bind(this);

  /*
  var texture = PIXI.Texture.fromImage("assets/logo_small.png");
  var interactionTest = new PIXI.Sprite(texture);
  interactionTest.buttonMode = true;
  // interactionTest.beginFill(0xFF0000, 1);
  // interactionTest.drawRect(100, 100, 200, 200);
  interactionTest.anchor.x = interactionTest.anchor.y = 0.5;
  interactionTest.position.x = interactionTest.position.y = 150;
  interactionTest.setInteractive(true);
  interactionTest.mouseover = function() { console.log('mouseover'); };
  interactionTest.mousewheel = function() { console.log("scrolled!"); };
  // interactionTest.endFill();
  this.stage.addChild(interactionTest);
  */

  //this.renderer.view.addEventListener("mousewheel", this.mouseWheelListener.bind(this), false);

  /*
  // PLAYING WITH FILTERS:
  var me = this;
  this.stage.click = this.stage.tap = function()
  {
    var tl = new TimelineLite();
    tl
      .to(me.pixelateFilter.uniforms.pixelSize.value, 2, { x: 20, y: 20 })
      .to(me.pixelateFilter.uniforms.pixelSize.value, 2, { x: 1, y: 1 })
      .to(me.blurFilter.blurXFilter.uniforms.blur, 1, { value: 0.005 })
      .to(me.blurFilter.blurYFilter.uniforms.blur, 1, { value: 0.005 })
      .to(me.blurFilter.blurXFilter.uniforms.blur, 1, { value: 0 })
      .to(me.blurFilter.blurYFilter.uniforms.blur, 1, { value: 0 });
  };

  this.blurFilter = new PIXI.BlurFilter();
  this.blurFilter.blurXFilter.uniforms.blur.value = 0;
  this.blurFilter.blurYFilter.uniforms.blur.value = 0;

  this.pixelateFilter = new PIXI.PixelateFilter();
  this.pixelateFilter.uniforms.pixelSize.value.x = 1;
  this.pixelateFilter.uniforms.pixelSize.value.y = 1;

  this.graphics.filters = [this.pixelateFilter, this.blurFilter];
  */
}
util.inherits(Parsecs, events.EventEmitter);

Parsecs.prototype.getNewContext = function(width, height) {
  var tempCanvas = document.createElement('canvas');
  tempCanvas.width = width;
  tempCanvas.height = height;
  var context = tempCanvas.getContext('2d');
  context.toSprite = function(scaleMode) {
    return new PIXI.Sprite(PIXI.Texture.fromCanvas(this.canvas, scaleMode));  
  };
  return context;
};

Parsecs.prototype.spriteFromContext = function(context) {
  return new PIXI.Sprite(PIXI.Texture.fromCanvas(context.canvas));
}

Parsecs.prototype.run = function(time) {
  this.timeCount += time / 100000;

  var deltaTime = time - this.lastTime;

  if (!isNaN(deltaTime)) {
    // update stuff
    this.emit('update', deltaTime);

    this.superLayer.scale.set(this.camera.zoom, this.camera.zoom);
    this.superLayer.position.set(this.camera.x, this.camera.y);

    // clear
    this.graphics.clear();

    // draw stuff
    this.emit('render', this.graphics);
    // this.graphics.tint = 'rgba(' + Math.round(Math.abs(Math.sin(this.timeCount)),2) + ',1,1,0.8)'; 
    // this.graphics.scale.x = 1.5 + Math.sin(this.timeCount);
    // this.graphics.scale.y = 1.5 + Math.sin(this.timeCount);
    this.renderer.render(this.stage);
  }

  // request new frame
  requestAnimFrame(Parsecs.prototype.run.bind(this));

  this.lastTime = time;
};

Parsecs.prototype.setClearColor = function(color) {
  //this.stage.setBackgroundColor(color);
};

Parsecs.prototype.getContext = function() {
  return this.context;
};

Parsecs.prototype.getHeight = function() {
  return this.renderer.height;
};

Parsecs.prototype.getWidth = function() {
  return this.renderer.width;
};

Parsecs.prototype.getStage = function() {
  return this.stage;
};

Parsecs.prototype.getGraphics = function() {
  return this.graphics;
};

Parsecs.prototype.getLayer = function() {
  return this.layer;
};

Parsecs.prototype.getWorld = function() {
  return this.world;
};

Parsecs.prototype.getCamera = function() {
  return this.camera;
};

Parsecs.prototype.mouseDownListener = function(data) {
  this.mouseDown = true;
  var mousePos = data.getLocalPosition(this.stage);
  this.emit('mousedown', { x: mousePos.x, y: mousePos.y });
};

Parsecs.prototype.mouseUpListener = function(evt) {
  evt.originalEvent.preventDefault();
  this.mouseDown = false;
  this.emit('mouseup', this.getMousePos(evt));
};

Parsecs.prototype.mouseMoveListener = function(evt) {
  evt.originalEvent.preventDefault();
  this.emit('mousemove', evt.getLocalPosition(this.stage));
  if (this.mouseDown) {
    this.mouseDragListener(evt);
  }
};

Parsecs.prototype.toWorldPosition = function(mousePos) {
  var width = this.getWidth();
  var height = this.getHeight();

  var centerX = -this.camera.x + (width / 2);
  var centerY = -this.camera.y + (height / 2);
  var posX = centerX + (mousePos.x - width / 2);
  var posY = centerY + (mousePos.y - height / 2);

  return { x: posX / this.camera.zoom, y: posY / this.camera.zoom };
};

function clamp(value, min, max) {
  return Math.min(Math.max(min, value), max);
}

/*
function getNormalizedMouseWheelZoom(evt) {
  var scrollAmount;
  if (evt.detail) {
      var deltaDetail = evt.wheelDelta / evt.detail;
      scrollAmount = (evt.wheelDelta && deltaDetail) ? (evt.detail / deltaDetail) : (-evt.detail / 1.35);
  } else {
      scrollAmount = evt.wheelDelta / 120;
  }

  if (scrollAmount < 1) {
      scrollAmount = (scrollAmount < -1) ? ((-Math.pow(scrollAmount, 2) - 224) / 225) : (scrollAmount);
  } else {
      scrollAmount = (Math.pow(scrollAmount, 2) + 224) / 225;
  }

  this.mouse.scrollAmount = Math.min(Math.max(scrollAmount / 2, -1), 1);
}
*/

Parsecs.prototype.mouseWheelListener = function(data) {
  data.originalEvent.preventDefault();
  var mousePos = data.getLocalPosition(this.stage);
  this.emit('mousewheel', { x: mousePos.x, y: mousePos.y, zoom: data.scrollAmount });
};

Parsecs.prototype.mouseDragListener = function(evt) {
  /*
  evt.preventDefault();
  var mousePos = this.getMousePos(evt);
  var diff = { x: mousePos.x - this.oldMousePos.x, y: mousePos.y - this.oldMousePos.y };

  this.emit('mousedrag', { x: mousePos.x, y: mousePos.y, diffX: diff.x, diffY: diff.y });
  this.oldMousePos = mousePos;
  */
};

Parsecs.prototype.testSpeech = function() {
  function createVoice(options) {
    options = options || {};
    console.log(options);
    var speech = new window.SpeechSynthesisUtterance();
    console.log(window.speechSynthesis.pending);
    var voices = window.speechSynthesis.getVoices();
    speech.voiceURI = 'native';
    speech.voice = voices[(options.voice === undefined ? 2 : options.voice)];
    speech.volume = options.volume || 1;
    speech.rate = options.rate || 1;
    speech.pitch = options.pitch || 1;
    speech.lang = options.lang || 'en-US';
    speech.onstart = function(event) {
      console.log('The utterance started to be spoken.');
    };
    speech.onend = function(event) {
      console.log('The utterance ended after ' + event.elapsedTime + ' seconds', event);
    };
    speech.speak = function(text) {
      if (window.speechSynthesis.speaking)
        window.speechSynthesis.cancel();
      this.text = text;
      window.speechSynthesis.speak(this);
    };
    return speech;
  }

  // TODO: Delay speech until window.speechSynthesis.getVoices() return a list of length > 0
  // good voices: [1, 0, 2, 13, 15, 19, 23, 26, 33]

  var voice = createVoice({
    voice: 1
  });

  voice.speak('Hello world!');
  //voice.speak('In an explosion of light, the sky turned so bright. When the fireworks was done, oh what was to come? Across the infinity of space, the universe had found its face.');
};

Parsecs.World = require("./world");
Parsecs.Camera = require("./camera");

module.exports = Parsecs;
  
