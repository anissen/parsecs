
var Parsecs = require('./parsecs');
var systems = require('./systems/systems');

var width = 1024;
var height = 768;
var parsecs = new Parsecs(width, height, document.getElementById('game'));
parsecs.setClearColor('white');
var context = parsecs.getContext();

var world = new Parsecs.World();

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

world.width = width * 4;
world.height = height * 4;

/*
world.entities.push({
  sprite: {
    shape: 'rect',
    color: 0x660066,
    alpha: 0.1,
    width: world.width,
    height: world.height
  },
  position: {
    x: world.width / 2,
    y: world.height / 2,
    rotation: 0
  }
});

world.entities.push({
  sprite: {
    shape: 'rect',
    color: 0x000066,
    alpha: 0.25,
    width: (world.width - 100),
    height: (world.height - 100)
  },
  position: {
    x: world.width / 2,
    y: world.height / 2,
    rotation: 0
  }
});
*/

for (var i = 0; i < 500; i++) {
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
    zoom: 0.3,
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

var updateFunc = function() {
  var layer = parsecs.getLayer();
  var clampedX = clamp(cameraEntity.position.x, (width / 2)  / cameraEntity.camera.zoom, world.width - (width / 2)  / cameraEntity.camera.zoom);
  var clampedY = clamp(cameraEntity.position.y, (height / 2)  / cameraEntity.camera.zoom, world.height - (height / 2)  / cameraEntity.camera.zoom);
  var cameraX = (-clampedX * cameraEntity.camera.zoom + width / 2);
  var cameraY = (-clampedY * cameraEntity.camera.zoom + height / 2);
  layer.position.set(cameraX, cameraY);
  layer.scale.set(cameraEntity.camera.zoom, cameraEntity.camera.zoom);
};

var renderFunc = function(layer) {
  systems.RenderSystem.tick(layer, world.getEntities());
};

parsecs.on('update', updateFunc);
parsecs.on('render', renderFunc);

parsecs.on('mousedown', function(pos) {
  var clampedX = clamp(cameraEntity.position.x, (width / 2)  / cameraEntity.camera.zoom, world.width - (width / 2)  / cameraEntity.camera.zoom);
  var clampedY = clamp(cameraEntity.position.y, (height / 2)  / cameraEntity.camera.zoom, world.height - (height / 2)  / cameraEntity.camera.zoom);
  var posX = clampedX + (pos.x - width / 2) / cameraEntity.camera.zoom; // TODO: Handle this in Parsecs::onMouseDown
  var posY = clampedY + (pos.y - height / 2) / cameraEntity.camera.zoom; // TODO: Handle this in Parsecs::onMouseDown

  var dist = Math.sqrt(Math.pow(cameraEntity.position.x - posX, 2) + Math.pow(cameraEntity.position.y - posY, 2));

  var tl = new TimelineLite();
  tl
    .to(cameraEntity.position, dist / 100, { x: posX, y: posY });
});

parsecs.on('mousemove', function(pos) {

});


parsecs.on('mousewheel', function(evt) {
  cameraEntity.camera.zoom += evt.zoom;
});

function clamp(value, min, max) {
  return Math.min(Math.max(min, value), max);
}

parsecs.on('mousedrag', function(evt) {
  // cameraEntity.position.x += (evt.diffX / cameraEntity.camera.zoom);  // we want to move the point of cursor strictly
  // cameraEntity.position.y += (evt.diffY / cameraEntity.camera.zoom);
});

parsecs.run();


var tl = new TimelineLite();
  tl
    .to(cameraEntity.camera, 10, { zoom: 2 });
