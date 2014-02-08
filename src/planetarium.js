
var Parsecs = require('./parsecs');
var systems = require('./systems/systems');

var parsecs = new Parsecs();
parsecs.setClearColor('white');
var context = parsecs.getContext();

var stage = new Parsecs.Stage();

function randomMonochromeColor(min, max) {
  min = min || 0;
  max = max || 255;
  var value = Math.floor(min + (max - min) * Math.random());
  return 'rgba(' + value + ',' + value + ',' + value + ',1)';
}

var width = parsecs.getWidth();
var height = parsecs.getHeight();

stage.width = width * 4;
stage.height = height * 4;

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

var cameraEntity = { 
  position: {
    x: -stage.width / 2,
    y: -stage.height / 2,
    rotation: 0
  },
  camera: {
    zoom: 1,
    originX: 0,
    originY: 0,
    active: true
  },
  sprite: {
    shape: 'rect',
    color: 'orange',
    width: 50,
    height: 50
  }
};
stage.entities.push(cameraEntity);

stage.entities.push({
  sprite: {
    shape: 'rect',
    color: 'pink',
    width: 100,
    height: 100
  },
  position: {
    x: (100) / 2,
    y: (100) / 2,
    rotation: 0
  }
});

stage.entities.push({
  sprite: {
    shape: 'rect',
    color: 'red',
    width: 100,
    height: 100
  },
  position: {
    x: stage.width - (100) / 2,
    y: stage.height - (100) / 2,
    rotation: 0
  }
});

for (var i = 0; i < 500; i++) {
  stage.entities.push({
    sprite: {
      shape: 'circle',
      color: randomMonochromeColor(230, 250),
      radius: 2 + Math.random() * 10
    },
    position: {
      x: Math.random() * stage.width,
      y: Math.random() * stage.height,
      rotation: 0
    }
  });
}

var planets = [];

function getPlanetPosition(radius, minDist) {
  while (true) {
    var pos = {
      x: minDist + radius + Math.random() * (stage.width - 2 * (minDist + radius)),
      y: minDist + radius + Math.random() * (stage.height - 2 * (minDist + radius))
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

    console.log('invalid, trying again');
  }
}

for (var i = 0; i < 20; i++) {
  var radius = 40 + Math.random() * 60; 
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
    },
    clickToZoom: {}
  };
  planets.push(planet);
  stage.entities.push(planet);
}

var updateFunc = function() {

};

var renderFunc = function() {
  systems.RenderSystem.tick(context, stage.getEntities());
};

var colors = ["#7FDBFF", "#0074D9", "#001F3F", "#39CCCC", "#2ECC40", "#3D9970", "#01FF70", "#FFDC00", "#FF851B", "#FF4136", "#F012BE", "#B10DC9", "#85144B", "#dddddd", "#aaaaaa"];

parsecs.on('update', updateFunc);
parsecs.on('render', renderFunc);

parsecs.on('mousedown', function(pos) {
  //cameraEntity.camera.zoom += 0.1;
});

parsecs.on('mousemove', function(pos) {
  // console.log('mousemove', pos);
  // 0 -> width / 2   
  // 1024 -> stage.width - width / 2
  //console.log(cameraEntity.position.x);
  //cameraEntity.position.x = width / 2 + pos.x * ((stage.width - width) / width);
  //cameraEntity.position.y = height / 2 + pos.y * ((stage.height - height) / height);

  /*
  var scale = cameraEntity.camera.zoom;
  var originX = cameraEntity.camera.originX;

  cameraEntity.position.x = pos.x / scale + originX - pos.x / (scale * zoom);
  */
});

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

  cameraEntity.position.x = nx; // renew positions
  cameraEntity.position.y = ny;   
  cameraEntity.camera.zoom = nz; // ... and zoom
}

parsecs.on('mousewheel', function(evt) {
  // console.log(evt.zoom);
  zoom(evt.zoom, evt.x, evt.y, 0.25, 10.0);
  correctCameraBounds();
});

function clamp(value, min, max) {
  // console.log(value, min, max, Math.min(Math.max(min, value), max));
  return Math.min(Math.max(min, value), max);
}

parsecs.on('mousedrag', function(evt) {
  cameraEntity.position.x += (evt.diffX / cameraEntity.camera.zoom);  // we want to move the point of cursor strictly
  cameraEntity.position.y += (evt.diffY / cameraEntity.camera.zoom);
  correctCameraBounds();
});

function correctCameraBounds() {
  cameraEntity.position.x = clamp(cameraEntity.position.x, (-stage.width + width / cameraEntity.camera.zoom), 0);
  cameraEntity.position.y = clamp(cameraEntity.position.y, (-stage.height + height / cameraEntity.camera.zoom), 0);
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
