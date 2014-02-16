
var assert = require('chai').assert;

describe('MotionSystem', function() {
  var systems = require('./../../src/systems/systems');
  var motionSystem = systems.MotionSystem;
  var entity;

  beforeEach(function(){
    entity = {
      position: {
        x: 0,
        y: 0,
        rotation: 0
      },
      motion: {
        dx: 1,
        dy: 1,
        drotation: 1
      }
    };

    assert.deepEqual(entity.position, { x: 0, y: 0, rotation: 0 });
    assert.deepEqual(entity.motion, { dx: 1, dy: 1, drotation: 1 });
  });

  it ('tick() should affect entity position', function() {
    motionSystem.tick(null, [entity]);
    assert.deepEqual(entity.position, { x: 1, y: 1, rotation: 1 });
  });
  it ('tick() twice should affect entity position twice', function() {
    motionSystem.tick(null, [entity]);
    motionSystem.tick(null, [entity]);
    assert.deepEqual(entity.position, { x: 2, y: 2, rotation: 2 });
  });
  it ('tick() should not affect entity motion', function() {
    motionSystem.tick(null, [entity]);
    assert.deepEqual(entity.motion, { dx: 1, dy: 1, drotation: 1 });
  });
});
