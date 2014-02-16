
var assert = require('chai').assert;

describe('RenderSystem', function() {
  var systems = require('./../../src/systems/systems');
  var renderSystem = systems.RenderSystem;

  describe('tick', function() {
    var rectEntity;
    var circleEntity;
    var layerMock;
    beforeEach(function() {
      rectEntity = {
        sprite: {
          shape: 'rect',
          color: 0xFFFFFF,
          alpha: 1,
          width: 100,
          height: 100
        },
        position: {
          x: 0,
          y: 0,
          rotation: 0
        }
      };

      circleEntity = {
        sprite: {
          shape: 'circle',
          color: 0xFFFFFF,
          alpha: 1,
          width: 100,
          height: 100
        },
        position: {
          x: 0,
          y: 0,
          rotation: 0
        }
      };

      layerMock = {
        beginFill: function() {},
        endFill: function() {},
        drawRect: function() {
          assert.ok(false);
        },
        drawCircle: function() {
          assert.ok(false);
        }
      };

      // assert.deepEqual(entity.position, { x: 0, y: 0, rotation: 0 });
      // assert.deepEqual(entity.motion, { dx: 1, dy: 1, drotation: 1 });
    });

    it ('should not affect entity position', function() {
      layerMock.drawRect = function() {}; // TODO: Use sinon.js ??
      renderSystem.tick(layerMock, [rectEntity]);
      assert.deepEqual(rectEntity.position, { x: 0, y: 0, rotation: 0 });
    });
    it ('should render "rect"', function() {
      layerMock.drawRect = function() {
        assert.ok(true);
      };
      renderSystem.tick(layerMock, [rectEntity]);
    });
    it ('should render "circle"', function() {
      layerMock.drawCircle = function() {
        assert.ok(true);
      };
      renderSystem.tick(layerMock, [circleEntity]);
    });
  });
});
