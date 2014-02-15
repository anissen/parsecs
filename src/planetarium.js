
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

world.entities.push({
  sprite: {
    shape: 'rect',
    color: 0x000066,
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
    },
    clickToZoom: {}
  };
  planets.push(planet);
  world.entities.push(planet);
}

var cameraEntity = { 
  position: {
    x: 0, //world.width / 2,
    y: 0, //world.height / 2,
    rotation: 0
  },
  camera: {
    zoom: 1,
    originX: 0,
    originY: 0,
    active: true
  },
  sprite: {
    shape: 'circle',
    color: 0x0000FF,
    alpha: 1,
    radius: 50
  }
};
world.entities.push(cameraEntity);

var updateFunc = function() {
  var layer = parsecs.getLayer();
  var clampedX = clamp(cameraEntity.position.x, width / 2, world.width - width / 2);
  var clampedY = clamp(cameraEntity.position.y, height / 2, world.height - height / 2);
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
  var posX = cameraEntity.position.x - (cameraEntity.position.x - pos.x); // TODO: Handle this in Parsecs::onMouseDown
  var posY = cameraEntity.position.y - (cameraEntity.position.y - pos.y); // TODO: Handle this in Parsecs::onMouseDown

  var tl = new TimelineLite();
  tl
    .to(cameraEntity.position, 2, { x: posX, y: posY });
});

parsecs.on('mousemove', function(pos) {
  // console.log('mousemove', pos);
  // 0 -> width / 2   
  // 1024 -> world.width - width / 2
  //console.log(cameraEntity.position.x);
  //cameraEntity.position.x = width / 2 + pos.x * ((world.width - width) / width);
  //cameraEntity.position.y = height / 2 + pos.y * ((world.height - height) / height);

  /*
  var scale = cameraEntity.camera.zoom;
  var originX = cameraEntity.camera.originX;

  cameraEntity.position.x = pos.x / scale + originX - pos.x / (scale * zoom);
  */
});

/*
function zoom(zf, px, py, min, max) {
  // zf - is a zoom factor, which in my case was one of (0.1, -0.1)
  // px, py coordinates - is point within canvas 
  // eg. px = evt.clientX - canvas.offset().left
  // py = evt.clientY - canvas.offset().top
  var z = cameraEntity.camera.zoom;
  var x = cameraEntity.position.x;
  var y = cameraEntity.position.y;

  var nz = z + zf; // getting new zoom
  if (nz < min) {
    zf -= (nz - min);
    nz = min;
  }
  if (nz > max) {
    zf += (max - nz);
    nz = max;
  }

  var K = (z * z + z * zf); // putting some magic
  var nx = x - ((px * zf) / K); 
  var ny = y - ((py * zf) / K);

  return { x: nx, y: ny, zoom: nz };
}
*/

parsecs.on('mousewheel', function(evt) {
  // console.log(evt.zoom);
  // var layer = parsecs.getLayer();
  //layer.scale.set(layer.scale.x + evt.zoom, layer.scale.y + evt.zoom);

  //var correctedEvt = zoom(evt.zoom / 4, evt.x, evt.y, 0.25, 10.0);
  //cameraEntity.position.x = clamp(correctedEvt.x, 0, world.width);
  //cameraEntity.position.y = clamp(correctedEvt.y, 0, world.height);
  cameraEntity.camera.zoom += evt.zoom;  

  var layer = parsecs.getLayer();
  // var viewX = cameraEntity.position.x;
  // var viewY = cameraEntity.position.y;
  layer.scale.set(cameraEntity.camera.zoom, cameraEntity.camera.zoom);
  //layer.position.set(-cameraEntity.position.x + width / 2, -cameraEntity.position.y + height / 2);
  //console.log(layer.position);
  //layer.position.set(correctedEvt.x - (layer.getBounds().width * correctedEvt.zoom) / 2, correctedEvt.y - (layer.getBounds().height * correctedEvt.zoom) / 2);
  // console.log(layer.getBounds());
});

function clamp(value, min, max) {
  return Math.min(Math.max(min, value), max);
}

parsecs.on('mousedrag', function(evt) {
  // cameraEntity.position.x += (evt.diffX / cameraEntity.camera.zoom);  // we want to move the point of cursor strictly
  // cameraEntity.position.y += (evt.diffY / cameraEntity.camera.zoom);
  // correctCameraBounds();
});

function correctCameraBounds() {
  // cameraEntity.position.x = clamp(cameraEntity.position.x, 0, world.width);
  // cameraEntity.position.y = clamp(cameraEntity.position.y, 0, world.height);
}

parsecs.run();

/*
var delay = require('./zoomPromise').Delay;
delay(2000, 200)
  .progress(function(prog) { 
    console.log('Progress:', prog);
  })
  .then(function(msg) { 
    console.log('Done! Msg:', msg);
  });
*/

// var tl = new TimelineLite();
// tl
//   .to(cameraEntity.position, 5, { x: world.width, y: 0 })
//   .to(cameraEntity.position, 5, { x: world.width, y: world.height })
//   .to(cameraEntity.position, 5, { x: 0, y: world.height })
//   .to(cameraEntity.position, 5, { x: 0, y: 0 })
//   .to(cameraEntity.position, 5, { x: planets[0].position.x, y: planets[0].position.y })
//   .to(cameraEntity.camera, 5, { zoom: 5 });
