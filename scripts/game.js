
var parsecs = require('./parsecs');

var entities = {};

var SpriteComponent = {
    width: 100,
    height: 100,
    shape: 'rect'
};
var PositionComponent = {
    x: 0,
    y: 0,
    rotation: 0
};
var MotionComponent = {
    dx: 0,
    dy: 0,
    drotation: 0
};

var MotionSystem = {
    tick: function() {
        for (var key in entities) {
            var e = entities[key];
            if (!e.PositionComponent || !e.MotionComponent) continue;
            e.PositionComponent.x += e.MotionComponent.dx;
            e.PositionComponent.y += e.MotionComponent.dy;
            //e.PositionComponent.rotation += e.MotionComponent.drotation;
        }
    }
};

var RenderSystem = {
  tick: function() {
    var context = parsecs.getContext();
    for (var key in entities) {
      var e = entities[key];
      if (!e.SpriteComponent || !e.PositionComponent) continue;

      context.beginPath();
      context.fillStyle = 'red';
      context.rect(e.PositionComponent.x, e.PositionComponent.y, e.SpriteComponent.width, e.SpriteComponent.height);
      context.fill();
      context.closePath();
    }
  }
};

// --------------------


entities['sdfaa aa'] = {
    SpriteComponent: {
        width: 100,
        height: 100
    },
    PositionComponent: {
        x: 100,
        y: 100,
        rotation: 0
    },
    MotionComponent: {
        dx: 1,
        dy: 0,
        drotation: 0.001
    }
};

entities['sa dfji'] = {
    SpriteComponent: {
        width: 150,
        height: 80
    },
    PositionComponent: {
        x: 250,
        y: 250,
        rotation: -0.2
    }
};

parsecs.addSystem(MotionSystem);
parsecs.addSystem(RenderSystem);

parsecs.run();
