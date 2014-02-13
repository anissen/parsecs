
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
    var cameraEntity = entities.filter(function(e) { return e.camera && e.camera.active; })[0];
    /*
    context.save();
    var width = 1024;
    var height = 800;

    context.save();
    context.scale(cameraEntity.camera.zoom, cameraEntity.camera.zoom);
    context.translate(cameraEntity.position.x, cameraEntity.position.y);

    // context.translate(cameraEntity.camera.originX, cameraEntity.camera.originY);
    // context.scale(cameraEntity.camera.zoom, cameraEntity.camera.zoom);
    // context.translate(cameraEntity.position.x, cameraEntity.position.y);

    // context.scale(cameraEntity.camera.zoom, cameraEntity.camera.zoom);
    // context.translate(-cameraEntity.position.x + width / 2, -cameraEntity.position.y + height / 2);
  */
    entities.filter(function(e) { return e.sprite && e.position; }).forEach(function(entity) {
      // TODO: Render everything every frame

      // draw a rectangel
      layer.beginFill(entity.sprite.color || '#FF0000', entity.sprite.alpha || 1);
      // layer.lineStyle(2, 0x0000FF, 1);
      if (entity.sprite.shape === 'circle') {
        layer.drawCircle(entity.position.x, entity.position.y, entity.sprite.radius);
      } else {
        layer.drawRect(entity.position.x - entity.sprite.width / 2, entity.position.y - entity.sprite.height / 2, entity.sprite.width, entity.sprite.height);
      }
      layer.endFill();

      /*
      context.save();

      context.translate(entity.position.x, entity.position.y);

      context.rotate(entity.position.rotation);

      context.strokeStyle = 'gray';
      context.fillStyle = entity.sprite.color || 'rgba(255,0,0,0.5)';
      context.beginPath();
      if (entity.sprite.shape === 'circle') {
        var radius = entity.sprite.radius;
        context.arc(0, 0, radius, 0, 2 * Math.PI, false);
      } else {
        context.strokeStyle = 'black';
        context.rect(-entity.sprite.width / 2, -entity.sprite.height / 2, entity.sprite.width, entity.sprite.height);
      }
      context.closePath();
      context.stroke();
      // context.stroke();
      context.fill();
      
      context.restore();
      */
    });

    // context.restore();
  }
};

