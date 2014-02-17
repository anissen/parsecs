
function World() {
  this.entities = [];
  //this.camera = null;
}

World.prototype.setSize = function(width, height) {
  this.width = width;
  this.height = height;
};

World.prototype.getWidth = function() {
  return this.width;
};

World.prototype.getHeight = function() {
  return this.height;
};

/*
World.prototype.getCamera = function() {
  return this.camera;
};
*/

World.prototype.getEntities = function() {
  return this.entities;
};

module.exports = World;
