
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

  this.graphics = new PIXI.Graphics();
  this.stage.addChild(this.graphics);

  this.stage.click = this.stage.tap = this.mouseDownListener.bind(this);
  this.stage.mousewheel = this.mouseWheelListener.bind(this);

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

Parsecs.prototype.run = function(time) {
  if (!this.timeCount)
    this.timeCount = 0;
  this.timeCount += time / 100000;

  var deltaTime = time - this.lastTime;

  // update stuff
  this.emit('update', deltaTime);

  // clear
  this.graphics.clear();

  // draw stuff
  this.emit('render', this.graphics);
  // this.graphics.tint = 'rgba(' + Math.round(Math.abs(Math.sin(this.timeCount)),2) + ',1,1,0.8)'; 
  // this.graphics.scale.x = 1.5 + Math.sin(this.timeCount);
  // this.graphics.scale.y = 1.5 + Math.sin(this.timeCount);
  this.renderer.render(this.stage);

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

Parsecs.prototype.mouseDownListener = function(data) {
  this.mouseDown = true;
  //var mousePos = this.getMousePos(data);
  //this.oldMousePos = mousePos;
  var mousePos = data.getLocalPosition(this.stage);
  this.emit('mousedown', { x: mousePos.x, y: mousePos.y });
};

Parsecs.prototype.mouseUpListener = function(evt) {
  evt.preventDefault();
  this.mouseDown = false;
  this.emit('mouseup', this.getMousePos(evt));
};

Parsecs.prototype.mouseMoveListener = function(evt) {
  evt.preventDefault();
  this.emit('mousemove', this.getMousePos(evt));
  if (this.mouseDown) {
    this.mouseDragListener(evt);
  }
};

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
  //console.log(data.scrollAmount);
  // var wheel = evt.wheelDelta / 120;//n or -n
  // var zoom = Math.pow(1 + Math.abs(wheel) / 2 , wheel > 0 ? 1 : -1);

  this.emit('mousewheel', { x: mousePos.x, y: mousePos.y, zoom: data.scrollAmount });
};

Parsecs.prototype.mouseDragListener = function(evt) {
  evt.preventDefault();
  var mousePos = this.getMousePos(evt);
  var diff = { x: mousePos.x - this.oldMousePos.x, y: mousePos.y - this.oldMousePos.y };

  this.emit('mousedrag', { x: mousePos.x, y: mousePos.y, diffX: diff.x, diffY: diff.y });
  this.oldMousePos = mousePos;
};

Parsecs.World = require("./world");

module.exports = Parsecs;
  
