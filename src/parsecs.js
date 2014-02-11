
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

  this.clearColor = null;
  this.lastTime = 0;
  this.oldMousePos = { x: 0, y: 0 };

  // create an new instance of a pixi stage
  this.stage = new PIXI.Stage(0xFFFFFF);

  this.stage.setInteractive(true);

  // create a renderer instance
  // the 5the parameter is the anti aliasing
  this.renderer = PIXI.autoDetectRenderer(width, height, null, false, true);

  // set the canvas width and height to fill the screen
  //renderer.view.style.width = window.innerWidth + "px";
  //renderer.view.style.height = window.innerHeight + "px";
  this.renderer.view.style.display = "block";

  // add render view to DOM
  domElement.appendChild(this.renderer.view);

  /*
  this.canvas.addEventListener("mousedown", this.mouseDownListener.bind(this), false);
  this.canvas.addEventListener("mouseup", this.mouseUpListener.bind(this), false);
  this.canvas.addEventListener("mousemove", this.mouseMoveListener.bind(this), false);
  this.canvas.addEventListener("mousewheel", this.mouseWheelListener.bind(this), false);
  */

  this.graphics = new PIXI.Graphics();

  // set a fill and line style
  this.graphics.beginFill(0xFF3300);
  this.graphics.lineStyle(10, 0xffd900, 1);

  // draw a shape
  this.graphics.moveTo(50,50);
  this.graphics.lineTo(250, 50);
  this.graphics.lineTo(100, 100);
  this.graphics.lineTo(250, 220);
  this.graphics.lineTo(50, 220);
  this.graphics.lineTo(50, 50);
  this.graphics.endFill();

  // set a fill and line style again
  this.graphics.lineStyle(10, 0xFF0000, 0.8);
  this.graphics.beginFill(0xFF700B, 1);

  // draw a second shape
  this.graphics.moveTo(210,300);
  this.graphics.lineTo(450,320);
  this.graphics.lineTo(570,350);
  this.graphics.lineTo(580,20);
  this.graphics.lineTo(330,120);
  this.graphics.lineTo(410,200);
  this.graphics.lineTo(210,300);
  this.graphics.endFill();

  // draw a rectangel
  this.graphics.lineStyle(2, 0x0000FF, 1);
  this.graphics.drawRect(50, 250, 100, 100);

  // draw a circle
/// this.graphics.lineStyle(0);
//  this.graphics.beginFill(0xFFFF0B, 0.5);
//  this.graphics.drawCircle(470, 200,100);

  this.graphics.lineStyle(20, 0x33FF00);
  this.graphics.moveTo(30,30);
  this.graphics.lineTo(600, 300);


  this.stage.addChild(this.graphics);
/*
  // lets create moving shape
  var thing = new PIXI.Graphics();
  this.stage.addChild(thing);
  thing.position.x = 620/2;
  thing.position.y = 380/2;
*/
  var count = 0;

  var me = this;
  this.stage.click = this.stage.tap = function()
  {
    me.graphics.lineStyle(Math.random() * 30, Math.random() * 0xFFFFFF, 1);
    me.graphics.moveTo(Math.random() * 620,Math.random() * 380);
    me.graphics.lineTo(Math.random() * 620,Math.random() * 380);
  }

  //graphics.filters = [new PIXI.BlurFilter()];
  //graphics.filters = [new PIXI.PixelateFilter()];
}
util.inherits(Parsecs, events.EventEmitter);

Parsecs.prototype.run = function(time) {
  // clear
  /*
  if (this.clearColor) {
    this.context.fillStyle = this.clearColor;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  } else {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
  */
  if (!this.timeCount)
    this.timeCount = 0;
  this.timeCount += time / 100000;

  var deltaTime = time - this.lastTime;

  // update stuff
  this.emit('update', deltaTime);

  // draw stuff
  this.graphics.clear();
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
  this.stage.setBackgroundColor(color);
};

Parsecs.prototype.getContext = function() {
  return this.context;
};

Parsecs.prototype.getHeight = function() {
  return this.stage.height;
};

Parsecs.prototype.getWidth = function() {
  return this.stage.width;
};

Parsecs.prototype.getMousePos = function(evt) {
  //getting mouse position correctly, being mindful of resizing that may have occured in the browser:
  var boundingRect = this.canvas.getBoundingClientRect();
  var mouseX = (evt.clientX - boundingRect.left) * (this.canvas.width / boundingRect.width);
  var mouseY = (evt.clientY - boundingRect.top) * (this.canvas.height / boundingRect.height);
  return { x: mouseX, y: mouseY };
};

Parsecs.prototype.mouseDownListener = function(evt) {
  evt.preventDefault();
  this.mouseDown = true;
  var mousePos = this.getMousePos(evt);
  this.oldMousePos = mousePos;
  this.emit('mousedown', mousePos);
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

function getNormalizedMouseWheelZoom(evt) {
  var d = evt.detail;
  var wheel = evt.wheelDelta;
  var n = 225;
  var n1 = n - 1;
  d = d ? wheel && (f = wheel / d) ? d / f : -d / 1.35 : wheel / 120;
  d = d < 1 ? d < -1 ? (-Math.pow(d, 2) - n1) / n : d : (Math.pow(d, 2) + n1) / n;
  return Math.min(Math.max(d / 2, -1), 1);
}

Parsecs.prototype.mouseWheelListener = function(evt) {
  evt.preventDefault();
  var mousePos = this.getMousePos(evt);
  // var wheel = evt.wheelDelta / 120;//n or -n
  // var zoom = Math.pow(1 + Math.abs(wheel) / 2 , wheel > 0 ? 1 : -1);

  this.emit('mousewheel', { x: mousePos.x, y: mousePos.y, zoom: getNormalizedMouseWheelZoom(evt) });
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
  
