
var Parsecs = require('./../src/parsecs');
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
    sprite: {
      shape: 'circle',
      color: 0x000000,
      alpha: 0.1 + Math.random() * 0.4,
      radius: 2 + Math.random() * 10
    },
    position: {
      x: Math.random() * world.width,
      y: Math.random() * world.height,
      rotation: 0
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
      var planetRadius = planet.sprite.radius;
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
  // console.log(pos);
  var planet = {
    sprite: {
      shape: 'circle',
      color: 0x000000,
      alpha: 1,
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
  world.entities.push(planet);
}

var cameraEntity = { 
  position: {
    x: world.width / 2,
    y: world.height / 2,
    rotation: 0
  },
  camera: {
    zoom: 1, //0.3,
    originX: 0,
    originY: 0,
    active: true
  },
  sprite: {
    shape: 'circle',
    color: 0x0000FF,
    alpha: 1,
    radius: 5
  }
};
world.entities.push(cameraEntity);

var cursorEntity = { 
  position: {
    x: world.width / 2,
    y: world.height / 2,
    rotation: 0
  },
  sprite: {
    shape: 'rect',
    color: 0x00FF33,
    alpha: 1,
    height: 25,
    width: 25
  }
};
world.entities.push(cursorEntity);

var camera = parsecs.getCamera();

var updateFunc = function() {
  var layer = parsecs.getLayer();

  var zoom = camera.zoom;
  //layer.scale.set(cameraEntity.camera.zoom, cameraEntity.camera.zoom);

  var clampedX = clamp(camera.x, (width / 2)  / zoom, world.width - (width / 2)  / zoom);
  var clampedY = clamp(camera.y, (height / 2)  / zoom, world.height - (height / 2)  / zoom);
  var cameraX = (-clampedX * zoom + width / 2);
  var cameraY = (-clampedY * zoom + height / 2);
  //layer.position.set(cameraX, cameraY);

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
  var dist = Math.sqrt(Math.pow(camera.x - worldPos.x, 2) + Math.pow(camera.y - worldPos.y, 2));

  // var tl = new TimelineLite();
  // tl
  //   .to(camera, dist / 100, { x: worldPos.x, y: worldPos.y });

  var t2 = new TimelineLite();
  t2
    .to(cameraEntity.position, dist / 100, { x: worldPos.x, y: worldPos.y });
    //.to(cameraEntity.camera, 10, { zoom: 2 }, '2');
});

parsecs.on('mousemove', function(pos) {
  var worldPos = parsecs.toWorldPosition(pos);
  cursorEntity.position.x = worldPos.x;
  cursorEntity.position.y = worldPos.y;

  var planetMouseOver = null;
  planets.forEach(function(planet) {
    planet.sprite.highlight = false;

    if (this.radius <= 0)
        return;
  
    var insideCircle = Math.pow(worldPos.x - planet.position.x, 2) + Math.pow(worldPos.y - planet.position.y, 2) <= Math.pow(planet.sprite.radius, 2);
    if (insideCircle) {
      planetMouseOver = planet;
    }
  });

  if (planetMouseOver) {
    planetMouseOver.sprite.highlight = true;
    var tl = new TimelineLite();
    tl
      .to(planetMouseOver.sprite, 1, { radius: planetMouseOver.sprite.radius * 1.5, ease: Elastic.easeInOut });
  }
});

parsecs.on('mousewheel', function(evt) {
  camera.zoom = clamp(camera.zoom + evt.zoom, 0.3, 10);
  console.log(camera.zoom);
});

function clamp(value, min, max) {
  return Math.min(Math.max(min, value), max);
}

parsecs.on('mousedrag', function(evt) {
  // cameraEntity.position.x += (evt.diffX / cameraEntity.camera.zoom);  // we want to move the point of cursor strictly
  // cameraEntity.position.y += (evt.diffY / cameraEntity.camera.zoom);
});

parsecs.run();

// var tl = new TimelineLite();
//   tl
//     .to(cameraEntity.camera, 10, { zoom: 2 });

// var delay = require('./zoomPromise').Delay;
// delay(2000, 200)
//   .progressed(function(prog) { 
//     console.log('Progress:', prog);
//   })
//   .then(function(msg) { 
//     console.log('Done! Msg:', msg);
//   });
