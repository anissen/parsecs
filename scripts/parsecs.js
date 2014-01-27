
var requestAnimFrame = (function(callback) {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
  function(callback) {
    window.setTimeout(callback, 1000 / 60);
  };
})();

var systems = [];

var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

function frame() {
  // clear
  context.clearRect(0, 0, canvas.width, canvas.height);

  // draw stuff
  systems.map(function(system) {
    system.tick();
  });

  // request new frame
  requestAnimFrame(frame);
}

module.exports = {
  addSystem: function(system) {
    systems.push(system);
  },
  run: function() {
    frame();
  },
  getContext: function() {
    return context;
  }
};
