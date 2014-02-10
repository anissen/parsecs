
function World() {
  this.entities = [];
  //this.camera = null;
}

/*
World.prototype.getCamera = function() {
  return this.camera;
};
*/

World.prototype.getEntities = function() {
  return this.entities;
};

module.exports = World;
