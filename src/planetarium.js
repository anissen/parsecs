
var Parsecs = require('./parsecs');
var systems = require('./systems/systems');

var parsecs = new Parsecs();
parsecs.setClearColor('white');
var context = parsecs.getContext();

var entities = [];

function randomMonochromeColor(min, max) {
  min = min || 0;
  max = max || 255;
  var value = Math.floor(min + (max - min) * Math.random());
  return 'rgba(' + value + ',' + value + ',' + value + ',1)';
}

var width = parsecs.getWidth();
var height = parsecs.getHeight();

console.log(width, height);

// Parameter Description
// x0  The x-coordinate of the starting circle of the gradient
// y0  The y-coordinate of the starting circle of the gradient
// r0  The radius of the starting circle
// x1  The x-coordinate of the ending circle of the gradient
// y1  The y-coordinate of the ending circle of the gradient
// r1  The radius of the ending circle
/*
var gradientFill = context.createRadialGradient(75, 50, 5, 90, 60, 100);
gradientFill.addColorStop(0, 'white');
gradientFill.addColorStop(1, 'black');
*/

for (var i = 0; i < 500; i++) {
  entities.push({
    sprite: {
      shape: 'circle',
      color: randomMonochromeColor(230, 250),
      radius: 2 + Math.random() * 10
    },
    position: {
      x: Math.random() * width,
      y: Math.random() * height,
      rotation: 0
    }
  });
}

var planets = [];

function getPlanetPosition(radius, minDist) {
  while(true) {
    var pos = { x: Math.random() * width, y: Math.random() * height };

    if (planets.length === 0)
      return pos;

    var validPos = true;
    for (var i = 0; i < planets.length; i++) {
      var planet = planets[i];
      var dist = Math.sqrt(Math.pow(pos.x - planet.position.x, 2) + Math.pow(pos.y - planet.position.y, 2));
      var planetRadius = planet.sprite.radius;
      if (dist - (planetRadius + radius) < minDist) {
        validPos = false;
        break;
      }
    }
    if (validPos)
      return pos;

    console.log('invalid, trying again');
  }
}

for (var i = 0; i < 25; i++) {
  var radius = 20 + Math.random() * 30; 
  var pos = getPlanetPosition(radius, 0);
  // console.log(pos);
  var planet = {
    sprite: {
      shape: 'circle',
      color: 'black', // gradientFill
      radius: radius
    },
    position: {
      x: pos.x,
      y: pos.y,
      rotation: 0
    },
    motion: {
      dx: 0,
      dy: 0,
      drotation: -0.01
    }
  };
  planets.push(planet);
  entities.push(planet);
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
