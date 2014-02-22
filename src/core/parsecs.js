
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

  this.stage.setInteractive(true);

  this.renderer = PIXI.autoDetectRenderer(width, height, domElement, false, true);

  /*
  this.canvas.addEventListener("mousedown", this.mouseDownListener.bind(this), false);
  this.canvas.addEventListener("mouseup", this.mouseUpListener.bind(this), false);
  this.canvas.addEventListener("mousemove", this.mouseMoveListener.bind(this), false);
  this.canvas.addEventListener("mousewheel", this.mouseWheelListener.bind(this), false);
  */
  this.world = new Parsecs.World();
  this.camera = new Parsecs.Camera();

  this.graphics = new PIXI.Graphics();
  this.stage.addChild(this.graphics);

  this.tempCanvas = {};
  this.tempCanvas = document.createElement('canvas');

  var context = this.getNewContext(256, 256);
  // context.strokeStyle = "#000000";
  context.fillStyle = '#000000';
  /*
  context.beginPath();

  context.arc(128, 128, 128, 0, 2 * Math.PI);
  context.fill();
  for (var i = 0; i < 100; i++) {
    context.beginPath();
    context.arc(Math.random() * 256, Math.random() * 256, 5, 0, 2 * Math.PI);
    context.fill();
  }
  */
  var bumpiness = 5;
  context.beginPath();
  for (var i = 0; i < (2 * Math.PI); i += 0.2) {
    if (i === 0)
      context.moveTo(128 + Math.cos(i) * 128, 128 + Math.sin(i) * 128);
    var x = 128 + Math.cos(i) * 128 + (-bumpiness / 2 + Math.random() * bumpiness);
    var y = 128 + Math.sin(i) * 128  + (-bumpiness / 2 + Math.random() * bumpiness);
    context.lineTo(x, y);
  }
  context.closePath();
  context.fill();
  // context.stroke();

  var planet = this.spriteFromContext(context);
  planet.x = 100;
  planet.y = 100;
  planet.scale.set(0.5, 0.5);
  this.stage.addChild(planet);

  this.stage.click = this.stage.tap = this.mouseDownListener.bind(this);
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
  this.tempCanvas.width = width;
  this.tempCanvas.height = height;
  return this.tempCanvas.getContext('2d');
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

    this.graphics.scale.set(this.camera.zoom, this.camera.zoom);
    this.graphics.position.set(this.camera.x, this.camera.y);

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

Parsecs.prototype.getLayer = function() {
  return this.graphics;
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

Parsecs.World = require("./world");
Parsecs.Camera = require("./camera");

module.exports = Parsecs;
  
