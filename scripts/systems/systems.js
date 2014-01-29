
module.exports.MotionSystem = {
  tick: function(context, entities) {
    entities.filter(function(e) { return e.Position && e.Motion; }).forEach(function(entity) {
      entity.Position.x += entity.Motion.dx;
      entity.Position.y += entity.Motion.dy;
      entity.Position.rotation += entity.Motion.drotation;
    });
  }
};

module.exports.TraceSystem = {
  tick: function(context, entities) {
    entities.filter(function(e) { return e.Trace && e.Position && e.Motion; }).forEach(function(entity) {
      entity.Trace.traces.splice(0, entity.Trace.traces.length - 100);
      entity.Trace.traces.push({ x: entity.Position.x, y: entity.Position.y });
      
      context.beginPath();
      context.strokeStyle = 'pink';
      context.moveTo(entity.Trace.traces[0].x, entity.Trace.traces[0].y);
      for (var i = 1; i < entity.Trace.traces.length; i++) {
        context.lineTo(entity.Trace.traces[i].x, entity.Trace.traces[i].y);
      }
      context.stroke();
      context.closePath();
    });
  }
};

module.exports.RenderSystem = {
  tick: function(context, entities) {
    entities.filter(function(e) { return e.Sprite && e.Position; }).forEach(function(entity) {
      // context.save();
      context.beginPath();
      context.fillStyle = 'rgba(255,0,0,0.5)';
      context.rect(entity.Position.x - entity.Sprite.width / 2, entity.Position.y - entity.Sprite.height / 2, entity.Sprite.width, entity.Sprite.height);
      context.fill();
      context.closePath();
      // context.restore();
    });
  }
};

module.exports.BounceSystem = {
  tick: function(context, entities) {
    entities.filter(function(e) { return e.Bounce && e.Position && e.Motion; }).forEach(function(entity) {
      if (entity.Position.x >= context.canvas.width)  entity.Motion.dx *= -1;
      if (entity.Position.x <= 0)                     entity.Motion.dx *= -1;
      if (entity.Position.y >= context.canvas.height) entity.Motion.dy *= -1;
      if (entity.Position.y <= 0)                     entity.Motion.dy *= -1;
    });
  }
};
