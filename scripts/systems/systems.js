
module.exports.MotionSystem = {
  tick: function(context, entities) {
    entities.filter(function(e) { return e.position && e.motion; }).forEach(function(entity) {
      entity.position.x += entity.motion.dx;
      entity.position.y += entity.motion.dy;
      entity.position.rotation += entity.motion.drotation;
    });
  }
};

module.exports.TraceSystem = {
  tick: function(context, entities) {
    entities.filter(function(e) { return e.trace && e.position && e.motion; }).forEach(function(entity) {
      entity.trace.traces.splice(0, entity.trace.traces.length - 100);
      entity.trace.traces.push({ x: entity.position.x, y: entity.position.y });
      
      context.beginPath();
      context.strokeStyle = 'pink';
      context.moveTo(entity.trace.traces[0].x, entity.trace.traces[0].y);
      for (var i = 1; i < entity.trace.traces.length; i++) {
        context.lineTo(entity.trace.traces[i].x, entity.trace.traces[i].y);
      }
      context.stroke();
      context.closePath();
    });
  }
};

module.exports.RenderSystem = {
  tick: function(context, entities) {
    entities.filter(function(e) { return e.sprite && e.position; }).forEach(function(entity) {
      context.save();

      context.translate(entity.position.x, entity.position.y);

      context.rotate(entity.position.rotation);

      context.fillStyle = entity.sprite.color || 'rgba(255,0,0,0.5)';
      context.fillRect(-entity.sprite.width / 2, -entity.sprite.height / 2, entity.sprite.width, entity.sprite.height);
      
      context.restore();
    });
  }
};

module.exports.BounceSystem = {
  tick: function(context, entities) {
    entities.filter(function(e) { return e.bounce && e.position && e.motion; }).forEach(function(entity) {
      if (entity.position.x >= context.canvas.width)  entity.motion.dx *= -1;
      if (entity.position.x <= 0)                     entity.motion.dx *= -1;
      if (entity.position.y >= context.canvas.height) entity.motion.dy *= -1;
      if (entity.position.y <= 0)                     entity.motion.dy *= -1;
    });
  }
};
