
function Camera() {
  this.x = 0;
  this.y = 0;
  this.zoom = 1;
}

Camera.prototype.getPosition = function() {
  return { x: this.x, y: this.y };
};

Camera.prototype.setPosition = function(pos) {
  this.x = pos.x;
  this.y = pos.y;
};

Camera.prototype.getZoom = function() {
  return this.zoom;
};

Camera.prototype.setZoom = function(zoom) {
  this.zoom = zoom;
};

module.exports = Camera;
