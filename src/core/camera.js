
function Camera() {
  var me = this;
  this.position = { x: 0, y: 0 };
  this.zoom = 1;

  return {
    set x(newX) {
      me.position.x = newX;
    },
    get x() {
      return me.position.x;
    },
    set y(newY) {
      me.position.y = newY;
    },
    get y() {
      return me.position.y;
    },
    set zoom(newZoom) {
      me.zoom = newZoom;
    },
    get zoom() {
      return me.zoom;
    }
  };
}

/* // Alternative way of defining getter/setters on Prototypes
Object.defineProperty(Camera.prototype, 'x', {
  get: function () {
    return this.position.x;
  },
  set: function (value) {
    this.position.x = value;
  }
});
*/

// TODO: Make a follow camera

module.exports = Camera;
