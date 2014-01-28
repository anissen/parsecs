
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

Parsecs.prototype.getEntities = function(filter) {
  var me = this;
  var keys = Object.keys(this.entities);
  return keys.map(function(key) { return me.entities[key]; }).filter(filter); // TODO: Use lodash
};

module.exports = Parsecs;
