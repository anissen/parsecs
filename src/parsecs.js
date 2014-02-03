
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

  this.canvas = document.getElementById('game');
  this.context = this.canvas.getContext('2d');

  this.canvas.addEventListener("mousedown", this.mouseDownListener.bind(this), false);
}
util.inherits(Parsecs, events.EventEmitter);

Parsecs.prototype.run = function() {
  // clear
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

  // update stuff
  this.emit('update');

  // draw stuff
  this.emit('render');

  // request new frame
  requestAnimFrame(Parsecs.prototype.run.bind(this));
};

Parsecs.prototype.getContext = function() {
  return this.context;
};

Parsecs.prototype.mouseDownListener = function(evt) {
  //getting mouse position correctly, being mindful of resizing that may have occured in the browser:
  var boundingRect = this.canvas.getBoundingClientRect();
  var mouseX = (evt.clientX - boundingRect.left) * (this.canvas.width / boundingRect.width);
  var mouseY = (evt.clientY - boundingRect.top) * (this.canvas.height / boundingRect.height);
  evt.preventDefault();
  this.emit('mousedown', { x: mouseX, y: mouseY });
};

module.exports = Parsecs;