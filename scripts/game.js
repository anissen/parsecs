
var Parsecs = require('./parsecs');
var systems = require('./systems/systems');

var parsecs = new Parsecs();

parsecs.entities = {};

parsecs.entities['sdfaa aa'] = {
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
};

parsecs.entities['sa dfji'] = {
    Sprite: {
        width: 150,
        height: 80
    },
    Position: {
        x: 250,
        y: 250,
        rotation: -0.2
    }
};


var updateFunc = function() {
  systems.MotionSystem.tick(parsecs);
  systems.BounceSystem.tick(parsecs);
};

var renderFunc = function() {
  systems.TraceSystem.tick(parsecs);
  systems.RenderSystem.tick(parsecs);
};

parsecs.on('update', updateFunc);
parsecs.on('render', renderFunc);

parsecs.run();

// setTimeout(function() {
//   parsecs.removeListener('update', updateFunc);
// }, 2000);

