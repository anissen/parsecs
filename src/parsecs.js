
var requestAnimFrame = (function(callback) {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
  function(callback) {
    window.setTimeout(callback, 1000 / 60);
  };
})();

var util = require("util");
var events = require("events");

function Parsecs() {
  events.EventEmitter.call(this);

  this.clearColor = null;
  this.lastTime = 0;
  this.oldMousePos = { x: 0, y: 0 };
  this.canvas = document.getElementById('game');
  this.context = this.canvas.getContext('2d');

  this.canvas.addEventListener("mousedown", this.mouseDownListener.bind(this), false);
  this.canvas.addEventListener("mouseup", this.mouseUpListener.bind(this), false);
  this.canvas.addEventListener("mousemove", this.mouseMoveListener.bind(this), false);
  this.canvas.addEventListener("mousewheel", this.mouseWheelListener.bind(this), false);
}
util.inherits(Parsecs, events.EventEmitter);

Parsecs.prototype.run = function(time) {
  // clear
  if (this.clearColor) {
    this.context.fillStyle = this.clearColor;
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
  } else {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  var deltaTime = time - this.lastTime;

  // update stuff
  this.emit('update', deltaTime);

  // draw stuff
  this.emit('render');

  // request new frame
  requestAnimFrame(Parsecs.prototype.run.bind(this));

  this.lastTime = time;
};

Parsecs.prototype.setClearColor = function(color) {
  this.clearColor = color;
};

Parsecs.prototype.getContext = function() {
  return this.context;
};

Parsecs.prototype.getHeight = function() {
  return this.canvas.height;
};

Parsecs.prototype.getWidth = function() {
  return this.canvas.width;
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

Parsecs.Stage = require("./stage");

module.exports = Parsecs;
