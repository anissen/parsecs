
var assert = require('chai').assert;

/*
var Parsecs = require('./../src/parsecs');
var parsecs = new Parsecs();

describe('parsecs', function() {
  it ('should be a function', function() {
    assert.equal(typeof(parsecs), "function");
  });
});
*/

var systems = require('./../src/systems/systems');

['RenderSystem', 'MotionSystem'].forEach(function(system) {
  describe(system, function() {
    it ('should be an object', function() {
      assert.isObject(systems[system]);
    });
    it ('should contain a "tick" function', function() {
      assert.isFunction(systems[system].tick);
    });
  });
});
