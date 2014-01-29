
var requestAnimFrame = (function(callback) {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
  function(callback) {
    window.setTimeout(callback, 1000 / 60);
  };
})();

var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

var util = require("util");
var events = require("events");

function Parsecs() {
  events.EventEmitter.call(this);
}
util.inherits(Parsecs, events.EventEmitter);

Parsecs.prototype.run = function() {
  // clear
  context.clearRect(0, 0, canvas.width, canvas.height);

  // update stuff
  this.emit('update');

  // draw stuff
  this.emit('render');

  // request new frame
  requestAnimFrame(Parsecs.prototype.run.bind(this));
};

Parsecs.prototype.getContext = function() {
  return context;
};

module.exports = Parsecs;
