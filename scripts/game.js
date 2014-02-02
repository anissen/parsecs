
var Parsecs = require('./parsecs');
var systems = require('./systems/systems');

var parsecs = new Parsecs();

var entities = [];

entities.push({
    sprite: {
	shape: 'circle',
	radius: 50
    },
    position: {
        x: 100,
        y: 100,
        rotation: 0
    },
    motion: {
	dx: 4,
	dy: 2.6,
	drotation: -0.01
    },
    trace: {
      traces: []
    },
    bounce: {}
});

entities.push({
    sprite: {
        width: 150,
	height: 80,
	shape: 'rect'
    },
    position: {
        x: 250,
        y: 250,
        rotation: -0.2
    }
});

var context = parsecs.getContext();

var bounceSystem = new systems.BounceSystem();

var updateFunc = function() {
  systems.MotionSystem.tick(context, entities);
  bounceSystem.tick(context, entities);
};

var renderFunc = function() {
  systems.TraceSystem.tick(context, entities);
  systems.RenderSystem.tick(context, entities);
};

var createEntityAtPos = function(pos) {
  entities.push({
    sprite: {
      radius: 20,
      shape: 'circle',
      color: colors[Math.floor(Math.random() * colors.length)]
    },
    position: {
      x: pos.x,
      y: pos.y,
      rotation: 0.1
    },
    motion: {
      dx: 0,
      dy: 0,
      drotation: (-0.5 + Math.random()) * 0.1
    }
  });
};

var colors = ["#7FDBFF", "#0074D9", "#001F3F", "#39CCCC", "#2ECC40", "#3D9970", "#01FF70", "#FFDC00", "#FF851B", "#FF4136", "#F012BE", "#B10DC9", "#85144B", "#dddddd", "#aaaaaa"];

parsecs.on('update', updateFunc);
parsecs.on('render', renderFunc);

parsecs.on('mousedown', createEntityAtPos);

bounceSystem.on('bounce', createEntityAtPos);

parsecs.run();

// setTimeout(function() {
//   parsecs.removeListener('update', updateFunc);
// }, 2000);
