
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
    entities.filter(function(e) { return e.position && e.circle; }).forEach(function(entity) {
      // TODO: Render everything every frame

      layer.beginFill(entity.circle.highlight ? 0xFF0000 : entity.circle.color, entity.circle.alpha);
      layer.drawCircle(entity.position.x, entity.position.y, entity.circle.radius);
      layer.endFill();
    });

    entities.filter(function(e) { return e.position && e.rectangle; }).forEach(function(entity) {
      // TODO: Render everything every frame

      layer.beginFill(entity.rectangle.color, entity.rectangle.alpha);
      layer.lineStyle(2, 0x0000FF, 1);
      layer.drawRect(entity.position.x - entity.rectangle.width / 2, entity.position.y - entity.rectangle.height / 2, entity.rectangle.width, entity.rectangle.height);
      layer.endFill();
    });
  }
};

