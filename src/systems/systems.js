
var util = require("util");
var events = require("events");

module.exports.MotionSystem = {
  tick: function(context, entities) {
    entities.filter(function(e) { return e.position && e.motion; }).forEach(function(entity) {
      entity.position.x += entity.motion.dx;
      entity.position.y += entity.motion.dy;
      entity.position.rotation += entity.motion.drotation;
    });
  }
};

module.exports.RenderSystem = {
  tick: function(layer, entities) {
    // var cameraEntity = entities.filter(function(e) { return e.camera && e.camera.active; })[0];
    entities.filter(function(e) { return e.sprite && e.position; }).forEach(function(entity) {
      // TODO: Render everything every frame

      // draw a rectangel
      layer.beginFill(entity.sprite.highlight ? 0xFF0000 : entity.sprite.color, entity.sprite.alpha);
      // layer.lineStyle(2, 0x0000FF, 1);
      if (entity.sprite.shape === 'circle') {
        layer.drawCircle(entity.position.x, entity.position.y, entity.sprite.radius);
      } else {
        layer.drawRect(entity.position.x - entity.sprite.width / 2, entity.position.y - entity.sprite.height / 2, entity.sprite.width, entity.sprite.height);
      }
      layer.endFill();
    });
  }
};

