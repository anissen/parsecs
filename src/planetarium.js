
var Parsecs = require('./parsecs');
var systems = require('./systems/systems');

var parsecs = new Parsecs();
parsecs.setClearColor('white');
var context = parsecs.getContext();

var entities = [];

function randomMonochromeColor() {
  var value = Math.floor(Math.random()*100);
  return 'rgba(' + value + ',' + value + ',' + value + ',1)';
}

for (var i = 0; i < 100; i++) {
  // Parameter Description
  // x0  The x-coordinate of the starting circle of the gradient
  // y0  The y-coordinate of the starting circle of the gradient
  // r0  The radius of the starting circle
  // x1  The x-coordinate of the ending circle of the gradient
  // y1  The y-coordinate of the ending circle of the gradient
  // r1  The radius of the ending circle
  var gradientFill = context.createRadialGradient(75, 50, 5, 90, 60, 100);
  gradientFill.addColorStop(0, 'white');
  gradientFill.addColorStop(1, 'black');

  entities.push({
    sprite: {
      shape: 'circle',
      color: gradientFill, //randomMonochromeColor(),
      radius: 10 + Math.random() * 20
    },
    position: {
      x: Math.random() * 800,
      y: Math.random() * 600,
      rotation: 0
    },
    motion: {
      dx: 0,
      dy: 0,
      drotation: -0.01
    }
  });
}


var updateFunc = function() {

};

var renderFunc = function() {
  systems.RenderSystem.tick(context, entities);
};

var colors = ["#7FDBFF", "#0074D9", "#001F3F", "#39CCCC", "#2ECC40", "#3D9970", "#01FF70", "#FFDC00", "#FF851B", "#FF4136", "#F012BE", "#B10DC9", "#85144B", "#dddddd", "#aaaaaa"];

parsecs.on('update', updateFunc);
parsecs.on('render', renderFunc);

//parsecs.on('mousedown', createEntityAtPos);

parsecs.run();
