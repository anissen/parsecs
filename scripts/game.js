
var Parsecs = require('./parsecs');
var systems = require('./systems/systems');

var parsecs = new Parsecs();

var entities = [];

entities.push({
    Sprite: {
        width: 100,
        height: 100
    },
    Position: {
        x: 100,
        y: 100,
        rotation: 0
    },
    Motion: {
        dx: 10,
        dy: 4.5,
        drotation: 0.001
    },
    Trace: {
      traces: []
    },
    Bounce: {}
});

entities.push({
    Sprite: {
        width: 150,
        height: 80
    },
    Position: {
        x: 250,
        y: 250,
        rotation: -0.2
    }
});

var context = parsecs.getContext();

var updateFunc = function() {
  systems.MotionSystem.tick(context, entities);
  systems.BounceSystem.tick(context, entities);
};

var renderFunc = function() {
  systems.TraceSystem.tick(context, entities);
  systems.RenderSystem.tick(context, entities);
};

parsecs.on('update', updateFunc);
parsecs.on('render', renderFunc);

parsecs.run();

// setTimeout(function() {
//   parsecs.removeListener('update', updateFunc);
// }, 2000);
