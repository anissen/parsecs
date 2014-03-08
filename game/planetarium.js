
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

var texture = PIXI.Texture.fromImage('./assets/starfield.png');
var tilingSprite = new PIXI.TilingSprite(texture, world.width, world.height);
// tilingSprite.scale.set(1);
// tilingSprite.alpha = 0.7;
parsecs.getLayer().addChild(tilingSprite);

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

var starTexture = PIXI.Texture.fromImage('./assets/star.png');
for (var i = 0; i < 200; i++) {
  var starSprite = new PIXI.Sprite(starTexture);
  starSprite.position.set(Math.random() * world.width, Math.random() * world.height);
  starSprite.scale.set(0.1 + Math.random() * 0.3);
  parsecs.getLayer().addChild(starSprite);
}

function generatePlanetSprite(planetRadius) {
  var planetContext = parsecs.getNewContext(512, 512);
  // planetContext.strokeStyle = '#CC6666';
  // planetContext.strokeWidth = 10;
  planetContext.fillStyle = '#FFFFFF';

  var bumpiness = 5;
  planetContext.beginPath();
  var centerX = 256;
  var centerY = 256;
  for (var i = 0; i < (2 * Math.PI); i += 0.1) {
    var radius = planetRadius; // + Math.random() * bumpiness;
    if (i === 0)
      planetContext.moveTo(centerX + Math.cos(i) * radius, centerY + Math.sin(i) * radius);
    else
      planetContext.lineTo(centerX + Math.cos(i) * radius, centerY + Math.sin(i) * radius);
  }
  planetContext.closePath();
  planetContext.fill();
  planetContext.fillStyle = '#DDDDDD';
  for (var i = 0; i < 20; i++) {
    var craterRadius = 10 + Math.random() * 20;

    planetContext.beginPath();
    planetContext.arc(centerX + Math.random() * Math.cos(i) * (planetRadius - craterRadius), centerY + Math.random() * Math.sin(i) * (planetRadius  - craterRadius), craterRadius, 0, Math.PI * 2);
    planetContext.closePath();
    planetContext.fill();
  }

  return planetContext.toSprite();
}

// planetContext.stroke();

for (var i = 0; i < 20; i++) {
  var planetRadius = 200;
  var scale = 0.2 + Math.random() * 0.3; // 40 + Math.random() * 60; 
  var planetSprite = generatePlanetSprite(planetRadius);
  planetSprite.scale.set(scale, scale);
  var radius = planetRadius * scale; //planetSprite.width / 2;
  var pos = getPlanetPosition(radius, 0);
  planetSprite.position.set(pos.x, pos.y);
  planetSprite.anchor.set(0.5, 0.5);
  planetSprite.interactive = true;
  planetSprite.tint = 0xCC9966;
  planetSprite.hitArea = new PIXI.Circle(0, 0, planetRadius);

  var textSprite = new PIXI.Text('Planet #' + (i + 1), {font: "bold italic 38px Arvo", fill: "white", align: "center", stroke: "black", strokeThickness: 5});
  textSprite.anchor.set(0.5, 0.5);
  textSprite.position.x = pos.x;
  textSprite.position.y = pos.y; // - (radius * 1.2) - textSprite.height / 2;
  textSprite.alpha = 0;
  parsecs.getLayer().addChild(textSprite);
  parsecs.getLayer().addChild(planetSprite);

  var planetRotation = -0.0002 + Math.random() * 0.0004;

  var planet = {
    position: {
      x: pos.x,
      y: pos.y,
      rotation: 0
    },
    textOnHover: {
      sprite: textSprite
    },
    sprite: {
      sprite: planetSprite,
      radius: radius
    },
    motion: {
      dx: 0,
      dy: 0,
      drotation: planetRotation
    } /*,
    obsticle: {
      avoidRadius: radius * 1.5
    } */
  };
  planets.push(planet);

  setupPlanetEvents(planetSprite, planet, textSprite);

  world.entities.push(planet);
}

function setupPlanetEvents(sprite, entity, textSprite) {
  var radius = entity.sprite.radius;
  var originalScale = sprite.scale.x;

  sprite.mouseover = function() {
    TweenLite.to(textSprite, 1, { y: sprite.position.y - radius * 1.2 - textSprite.height / 2, alpha: 1, ease: Elastic.easeOut });
    TweenLite.to(sprite.scale, 0.5, { x: originalScale * 1.2, y: originalScale * 1.2, ease: Elastic.easeOut });
  };

  sprite.mouseout = function() {
    TweenLite.to(textSprite, 1, { y: sprite.position.y, alpha: 0, ease: Elastic.easeIn });
    TweenLite.to(sprite.scale, 0.5, { x: originalScale, y: originalScale, ease: Elastic.easeInOut });
  };

  sprite.click = function() {
    // console.log('planet click');

    var distPlantToShip = Math.sqrt(Math.pow(shipEntity.position.x - sprite.position.x, 2) + Math.pow(shipEntity.position.y - sprite.position.y, 2));
    var unitVector = { 
      x: (shipEntity.position.x - sprite.position.x) / distPlantToShip, 
      y: (shipEntity.position.y - sprite.position.y) / distPlantToShip
    };
    var destination = { 
      x: sprite.position.x + unitVector.x * radius * 2, 
      y: sprite.position.y + unitVector.y * radius * 2 
    };
    var dist = Math.sqrt(Math.pow(shipEntity.position.x - destination.x, 2) + Math.pow(shipEntity.position.y - destination.y, 2));

    var tl = new TimelineLite({ onComplete: function() {
      shipEntity.misc.landed = true;
      shipEntity.misc.landedOnPlanet = entity;
      shipEntity.misc.startRotation = entity.position.rotation - Math.atan2(sprite.position.y - shipEntity.position.y, sprite.position.x - shipEntity.position.x);
      shipEntity.motion.drotation = 0;
    } });

    var travelTime = dist / 100;
    tl
      .to(shipEntity.position, travelTime, { x: destination.x, y: destination.y })
      .to(camera, 5, { zoom: 3 }, '-=2')
      .to(shipEntity.position, 2, { rotation: (Math.atan2(destination.y - shipEntity.position.y, destination.x - shipEntity.position.x) - Math.PI / 2) % (Math.PI * 2) }, '-=3')
      .to(shipEntity.position, 2, { x: this.position.x + unitVector.x * radius * 1.2 /* TODO: Fix this value */, y: this.position.y + unitVector.y * radius * 1.2 });

    // cursorEntity.sprite.sprite.scale.set(2);
    // TweenLite.to(cursorEntity.sprite.sprite.scale, 0.3, { x: 0.3, y: 0.3, ease: Bounce.easeOut });
  };
}

var spaceshipTexture = PIXI.Texture.fromImage('./assets/spaceship.png');
var spaceshipSprite = new PIXI.Sprite(spaceshipTexture);
spaceshipSprite.anchor.set(0.5, 0.5);
// spaceshipSprite.pivot.set(0.5, 0.5);
spaceshipSprite.scale.set(0.1);
parsecs.getLayer().addChild(spaceshipSprite);

var shipEntity = { 
  position: {
    x: world.width / 2,
    y: world.height / 2,
    rotation: 0
  },
  motion: {
    dx: 0,
    dy: 0,
    drotation: 0
  },
  sprite: {
    sprite: spaceshipSprite
  },
  misc: {}/*,
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
  }
};

var camera = parsecs.getCamera();

// var lastShipPosX = shipEntity.position.x;
// var lastShipPosY = shipEntity.position.y;

var updateFunc = function(deltaTime) {
  systems.MotionSystem.tick(world.getEntities(), deltaTime);
  systems.EmitterSystem.tick(world.getEntities(), deltaTime);

  if (shipEntity.misc.landed) {
    var planet = shipEntity.misc.landedOnPlanet;
    var rot = planet.position.rotation - shipEntity.misc.startRotation;
    shipEntity.position.rotation = rot - Math.PI / 2;
    shipEntity.position.x = planet.position.x - Math.cos(rot) * planet.sprite.radius * 1.2;
    shipEntity.position.y = planet.position.y - Math.sin(rot) * planet.sprite.radius * 1.2;
  }

  // TODO: Make this into a component/system
  // if (shipEntity.landing !== true && (shipEntity.position.x !== lastShipPosX || shipEntity.position.y !== lastShipPosY)) {
  //   shipEntity.sprite.sprite.rotation = Math.atan2(lastShipPosY - shipEntity.position.y, lastShipPosX - shipEntity.position.x) - Math.PI / 2;
  // }
  // lastShipPosX = shipEntity.position.x;
  // lastShipPosY = shipEntity.position.y;

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
  console.log('mouse down layer');
  var worldPos = parsecs.toWorldPosition(pos);
  var dist = Math.sqrt(Math.pow(shipEntity.position.x - worldPos.x, 2) + Math.pow(shipEntity.position.y - worldPos.y, 2));

  TweenLite.to(shipEntity.position, dist / 100, { x: worldPos.x, y: worldPos.y });
  cursorEntity.sprite.sprite.scale.set(2);
  TweenLite.to(cursorEntity.sprite.sprite.scale, 0.3, { x: 0.3, y: 0.3, ease: Bounce.easeOut });
});

parsecs.on('mousewheel', function(evt) {
  TweenLite.to(camera, 0.2, { zoom: clamp(camera.zoom + evt.zoom, 0.5, 8) });
});

function clamp(value, min, max) {
  return Math.min(Math.max(min, value), max);
}

parsecs.run();

// Expose for testing
window.parsecs = parsecs;

// TODO: Only run GSAP on each frame

