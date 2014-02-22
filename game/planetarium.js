
var Parsecs = require('./../src/core/parsecs');
var systems = require('./../src/systems/systems');

var width = 1024;
var height = 768;
var parsecs = new Parsecs(width, height, document.getElementById('game'));
parsecs.setClearColor('white');
var context = parsecs.getContext();

var world = parsecs.getWorld();

function randomMonochromeColor(min, max) {
  min = min || 0;
  max = max || 255;
  var value = Math.floor(min + (max - min) * Math.random());
  return 'rgba(' + value + ',' + value + ',' + value + ',1)';
}

function randomMonochromeColorHex(min, max) {
  min = min || 0;
  max = max || 255;
  var value = Math.floor(min + (max - min) * Math.random());
  var hexValue = value.toString(16);
  return '#0x' + hexValue + hexValue + hexValue;
}

world.setSize(width * 4, height * 4);

for (var i = 0; i < 700; i++) {
  world.entities.push({
    position: {
      x: Math.random() * world.width,
      y: Math.random() * world.height,
      rotation: 0
    },
    circle: {
      color: 0x000000,
      alpha: 0.1 + Math.random() * 0.4,
      radius: 2 + Math.random() * 10
    }
  });
}

var planets = [];

function getPlanetPosition(radius, minDist) {
  while (true) {
    var pos = {
      x: minDist + radius + Math.random() * (world.width - 2 * (minDist + radius)),
      y: minDist + radius + Math.random() * (world.height - 2 * (minDist + radius))
    };

    if (planets.length === 0)
      return pos;

    var validPos = true;
    for (var i = 0; i < planets.length; i++) {
      var planet = planets[i];
      var dist = Math.sqrt(Math.pow(pos.x - planet.position.x, 2) + Math.pow(pos.y - planet.position.y, 2));
      var planetRadius = planet.circle.radius;
      if (dist - (planetRadius + radius) < minDist) {
        validPos = false;
        break;
      }
    }
    if (validPos)
      return pos;
  }
}

for (var i = 0; i < 20; i++) {
  var radius = 40 + Math.random() * 60; 
  var pos = getPlanetPosition(radius, 0);
  var planet = {
    position: {
      x: pos.x,
      y: pos.y,
      rotation: 0
    },
    circle: {
      color: 0x000000,
      alpha: 1,
      radius: radius
    },
    motion: {
      dx: 0,
      dy: 0,
      drotation: -0.01
    }
  };
  planets.push(planet);
  world.entities.push(planet);
}

var shipGraphics = new PIXI.Graphics();
shipGraphics.beginFill(0x2244CC, 1);
shipGraphics.lineStyle(1, 0x4422CC, 1);

// draw a second shape
shipGraphics.moveTo(0, -15);
shipGraphics.lineTo(10, 15);
shipGraphics.lineTo(-10, 15);
shipGraphics.lineTo(0, -15);
shipGraphics.endFill();

parsecs.getLayer().addChild(shipGraphics);

var shipEntity = { 
  position: {
    x: world.width / 2,
    y: world.height / 2,
    rotation: 0
  },
  // motion: {
  //   dx: 0,
  //   dy: 0,
  //   drotation: 0.001
  // },
  ship: {
    graphics: shipGraphics,
    color: 0x0000FF,
    alpha: 1,
    radius: 20
  }/*,
  emitter: {
    delay: 100,
    countDown: 100,
    particleLife: 2,
    particles: []
  }*/
};
world.entities.push(shipEntity);

var cursorEntity = { 
  position: {
    x: world.width / 2,
    y: world.height / 2,
    rotation: 0
  },
  rectangle: {
    color: 0x00FF33,
    alpha: 1,
    height: 25,
    width: 25
  }
};
world.entities.push(cursorEntity);

var camera = parsecs.getCamera();

var updateFunc = function(deltaTime) {
  systems.MotionSystem.tick(world.getEntities(), deltaTime);
  systems.EmitterSystem.tick(world.getEntities(), deltaTime);

  // TODO: Move this logic to parsecs and/or camera
  var clampedX = clamp(shipEntity.position.x, (width / 2)  / camera.zoom, world.width - (width / 2)  / camera.zoom);
  var clampedY = clamp(shipEntity.position.y, (height / 2)  / camera.zoom, world.height - (height / 2)  / camera.zoom);
  var cameraX = (-clampedX * camera.zoom + width / 2);
  var cameraY = (-clampedY * camera.zoom + height / 2);

  camera.x = cameraX;
  camera.y = cameraY;
};

var renderFunc = function(layer) {
  systems.RenderSystem.tick(layer, world.getEntities());
};

parsecs.on('update', updateFunc);
parsecs.on('render', renderFunc);

parsecs.on('mousedown', function(pos) {
  var worldPos = parsecs.toWorldPosition(pos);
  var dist = Math.sqrt(Math.pow(shipEntity.position.x - worldPos.x, 2) + Math.pow(shipEntity.position.y - worldPos.y, 2));

  var t2 = new TimelineLite();
  t2
    .to(shipEntity.position, dist / 100, { x: worldPos.x, y: worldPos.y });
});

parsecs.on('mousemove', function(pos) {
  var worldPos = parsecs.toWorldPosition(pos);
  cursorEntity.position.x = worldPos.x;
  cursorEntity.position.y = worldPos.y;

  var planetMouseOver = null;
  planets.forEach(function(planet) {
    planet.circle.highlight = false;

    if (this.radius <= 0)
        return;
  
    var insideCircle = Math.pow(worldPos.x - planet.position.x, 2) + Math.pow(worldPos.y - planet.position.y, 2) <= Math.pow(planet.circle.radius, 2);
    if (insideCircle) {
      planetMouseOver = planet;
    }
  });

  if (planetMouseOver) {
    planetMouseOver.circle.highlight = true;
    var tl = new TimelineLite();
    tl
      .to(planetMouseOver.circle, 1, { radius: planetMouseOver.circle.radius * 1.5, ease: Elastic.easeInOut });
  }
});

parsecs.on('mousewheel', function(evt) {
  camera.zoom = clamp(camera.zoom + evt.zoom, 0.3, 10);
});

function clamp(value, min, max) {
  return Math.min(Math.max(min, value), max);
}

parsecs.on('mousedrag', function(evt) {

});

parsecs.run();

/*
function dot(prop, obj) { return obj[prop]; }
var dotCircle = dot.bind(null, 'circle');

var tl = new TimelineLite();
tl
  .staggerFrom(planets.map(dotCircle), 2, { radius: 0, ease: Elastic.easeOut }, 0.1);
*/

// var delay = require('./zoomPromise').Delay;
// delay(2000, 200)
//   .progressed(function(prog) { 
//     console.log('Progress:', prog);
//   })
//   .then(function(msg) { 
//     console.log('Done! Msg:', msg);
//   });
