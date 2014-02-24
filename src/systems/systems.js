
var util = require("util");
var events = require("events");

module.exports.MotionSystem = {
  tick: function(entities, deltaTime) {
    entities.filter(function(e) { return e.position && e.motion; }).forEach(function(entity) {
      entity.position.x += entity.motion.dx * deltaTime;
      entity.position.y += entity.motion.dy * deltaTime;
      entity.position.rotation += entity.motion.drotation * deltaTime;
      if (entity.sprite) {
        var sprite = entity.sprite.sprite;
        sprite.position.x = entity.position.x;
        sprite.position.y = entity.position.y;
        sprite.rotation = entity.position.rotation;
      }
    });
  }
};

module.exports.RenderSystem = {
  tick: function(layer, entities) {
    // TODO: Render everything every frame

    entities.filter(function(e) { return e.position && e.rectangle; }).forEach(function(entity) {
      layer.beginFill(entity.rectangle.color, entity.rectangle.alpha);
      // layer.lineStyle(2, 0x0000FF, 1);
      layer.drawRect(entity.position.x - entity.rectangle.width / 2, entity.position.y - entity.rectangle.height / 2, entity.rectangle.width, entity.rectangle.height);
      layer.endFill();
    });

    entities.filter(function(e) { return e.position && e.circle; }).forEach(function(entity) {
      layer.beginFill(entity.circle.highlight ? 0xFF0000 : entity.circle.color, entity.circle.alpha);
      layer.drawCircle(entity.position.x, entity.position.y, entity.circle.radius);
      layer.endFill();
    });
  }
};

module.exports.EmitterSystem = {
  tick: function(entities, deltaTime) {
    entities.filter(function(e) { return e.emitter && e.position; }).forEach(function(entity) {
      entity.emitter.countDown -= deltaTime;
      if (entity.emitter.countDown > 0) return;

      entity.emitter.countDown += entity.emitter.delay;

      var particle = {
        position: {
          x: entity.position.x,
          y: entity.position.y
        },
        circle: {
          color: 0xFF0000,
          alpha: 0.2,
          radius: 10
        },
        particle: {
          life: entity.emitter.particleLife
        }
      };

      entity.emitter.particles.push(particle);
      entities.push(particle);
    });
  }
};

