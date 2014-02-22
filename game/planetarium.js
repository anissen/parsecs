
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

var rgba = function(r, g, b, a) {
  r = Math.floor(r * 255);
  g = Math.floor(g * 255);
  b = Math.floor(b * 255);
  return "rgba(" + r + "," + g + "," + b + "," + a + ")";
};

var starContext = parsecs.getNewContext(128, 128);
var gradient = starContext.createRadialGradient(64, 64, 64, 64, 64, 0);
gradient.addColorStop(0, rgba(1, 1, 1, 0));
gradient.addColorStop(1, rgba(0, 0, 0, 1));

// context.strokeStyle = "#000000";
// starContext.fillStyle = '#000000';
starContext.fillStyle = gradient;
starContext.beginPath();
starContext.arc(64, 64, 64, 0, 2 * Math.PI);
starContext.closePath();
starContext.fill();
// starContext.stroke();


for (var i = 0; i < 1000; i++) {
  var x = Math.random() * world.width; 
  var y = Math.random() * world.height; 
  var scale = 1 + Math.random() * 1;
  var alpha = Math.random() * 0.3;

  var starSprite = starContext.toSprite();
  starSprite.scale.set(scale, scale);
  parsecs.getLayer().addChild(starSprite);
  starSprite.position.set(x, y);
  starSprite.alpha = alpha;

  world.entities.push({
    position: {
      x: x,
      y: y,
      rotation: 0
    },
    sprite: {
      sprite: starSprite
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
      var planetRadius = planet.sprite.sprite.width / 2;
      if (dist - (planetRadius + radius) < minDist) {
        validPos = false;
        break;
      }
    }
    if (validPos)
      return pos;
  }
}

var planetContext = parsecs.getNewContext(256, 256);
// context.strokeStyle = "#000000";
planetContext.fillStyle = '#000000';

var planetRadius = 100;
var bumpiness = 5;
planetContext.beginPath();
for (var i = 0; i < (2 * Math.PI); i += 0.1) {
  var centerX = 128;
  var centerY = 128;
  var radius = planetRadius + Math.random() * bumpiness;
  if (i === 0)
    planetContext.moveTo(centerX + Math.cos(i) * radius, centerY + Math.sin(i) * radius);
  else
    planetContext.lineTo(centerX + Math.cos(i) * radius, centerY + Math.sin(i) * radius);
}
planetContext.closePath();
planetContext.fill();
// planetContext.stroke();



for (var i = 0; i < 20; i++) {
  var scale = 0.3 + Math.random() * 0.7; // 40 + Math.random() * 60; 
  var planetSprite = planetContext.toSprite();
  planetSprite.scale.set(scale, scale);
  parsecs.getLayer().addChild(planetSprite);
  var radius = planetRadius * scale; //planetSprite.width / 2;
  var pos = getPlanetPosition(radius, 0);
  planetSprite.position.set(pos.x, pos.y);
  planetSprite.anchor.set(0.5, 0.5);
  planetSprite.interactive = true;
  // planetSprite.buttonMode = true;
  planetSprite.hitArea = new PIXI.Circle(0, 0, planetRadius);
  (function(scale) {
    planetSprite.mouseover = function(event) {
      var planet = event.target;
      TweenLite.to(planet.scale, 0.5, { x: scale * 1.2, y: scale * 1.2, ease: Elastic.easeOut });
    };
    planetSprite.mouseout = function(event) {
      var planet = event.target;
      TweenLite.to(planet.scale, 0.5, { x: scale, y: scale, ease: Elastic.easeInOut });
    };
  })(scale);

  var planet = {
    position: {
      x: pos.x,
      y: pos.y,
      rotation: 0
    },
    sprite: {
      sprite: planetSprite,
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

var context = parsecs.getNewContext(128, 128);
var shipCenterX = 64;
var shipCenterY = 64;
// context.fillStyle = 'red';
// context.fillRect(0, 0, 128, 128);
context.fillStyle = 'blue';
context.beginPath();
context.arc(shipCenterX, shipCenterY - 16, 32, 0, 2 * Math.PI);
context.fill();
context.fillRect(shipCenterX - 32, shipCenterY - 16, 64, 64);
context.fillStyle = 'darkblue';
context.fillRect(shipCenterX - 32 - 8, shipCenterY + 28, 16, 32);
context.fillRect(shipCenterX + 32 - 8, shipCenterY + 28, 16, 32);

var shipSprite = context.toSprite();
shipSprite.anchor.set(0.5, 0.5);
// shipSprite.pivot.set(0.5, 0.5);
shipSprite.scale.set(0.3, 0.3);
parsecs.getLayer().addChild(shipSprite);

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
    graphics: shipSprite,
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

var cursorContext = parsecs.getNewContext(48, 48);
cursorContext.strokeStyle = 'darkgreen';
cursorContext.fillStyle = 'green';
cursorContext.beginPath();
cursorContext.arc(24, 24, 20, 0, 2 * Math.PI);
cursorContext.fill();
cursorContext.stroke();

var cursorSprite = cursorContext.toSprite();
cursorSprite.anchor.set(0.5, 0.5);
cursorSprite.scale.set(0.3, 0.3);
parsecs.getLayer().addChild(cursorSprite);

var cursorEntity = { 
  position: {
    x: world.width / 2,
    y: world.height / 2,
    rotation: 0
  },
  sprite: {
    sprite: cursorSprite
  }/*
  circle: {
    color: 0x00FF33,
    alpha: 1,
    radius: 10
  }*/
};
// world.entities.push(cursorEntity);

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

  var mousePos = parsecs.getStage().getMousePosition();
  var worldPos = parsecs.toWorldPosition(mousePos);
  cursorEntity.sprite.sprite.position.x = worldPos.x; // TODO: Make a System to handle cursors!
  cursorEntity.sprite.sprite.position.y = worldPos.y;
};

var renderFunc = function(layer) {
  systems.RenderSystem.tick(layer, world.getEntities());
};

parsecs.on('update', updateFunc);
parsecs.on('render', renderFunc);

parsecs.on('mousedown', function(pos) {
  var worldPos = parsecs.toWorldPosition(pos);
  var dist = Math.sqrt(Math.pow(shipEntity.position.x - worldPos.x, 2) + Math.pow(shipEntity.position.y - worldPos.y, 2));

  TweenLite.to(shipEntity.position, dist / 100, { x: worldPos.x, y: worldPos.y });
  cursorEntity.sprite.sprite.scale.set(2);
  TweenLite.to(cursorEntity.sprite.sprite.scale, 0.3, { x: 0.3, y: 0.3, ease: Bounce.easeOut });
});

parsecs.on('mousemove', function(pos) {

});

parsecs.on('mousewheel', function(evt) {
  TweenLite.to(camera, 0.2, { zoom: clamp(camera.zoom + evt.zoom, 0.5, 8) });
});

function clamp(value, min, max) {
  return Math.min(Math.max(min, value), max);
}

parsecs.on('mousedrag', function(evt) {

});

parsecs.run();

// Expose for testing
window.parsecs = parsecs;

// TODO: Only run GSAP on each frame

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
