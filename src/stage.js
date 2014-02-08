
function Stage() {
  this.entities = [];
  //this.camera = null;
}

/*
Stage.prototype.getCamera = function() {
  return this.camera;
};
*/

Stage.prototype.getEntities = function() {
  return this.entities;
};

module.exports = Stage;
