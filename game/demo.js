
var PixiDemo = require('../src/core/pixidemo.js');

var requestAnimationFrame =     window.requestAnimationFrame       ||
                                window.webkitRequestAnimationFrame ||
                                window.mozRequestAnimationFrame    ||
                                window.oRequestAnimationFrame      ||
                                window.msRequestAnimationFrame     ||
                                function( callback ){ window.setTimeout(callback, 1000 / 60); } 

var demo = new PixiDemo();

demo.w = $(window).width();
demo.h = $(window).height();
demo.init();

var graphics = new PIXI.Graphics();
graphics.beginFill(0xFF0000);
graphics.drawRect(500, 500, 200, 200);
graphics.endFill();
demo.drawShapeGraphics.addChild(graphics);

var tempCanvas = document.createElement('canvas');
tempCanvas.width = 128;
tempCanvas.height = 128;
var context = tempCanvas.getContext('2d');
var gradient = context.createRadialGradient(64, 64, 64, 64, 64, 0);
gradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
gradient.addColorStop(1, 'rgba(0, 0, 0, 1)');

// context.strokeStyle = "#000000";
// context.fillStyle = '#000000';
context.fillStyle = gradient;
context.beginPath();
context.arc(64, 64, 64, 0, 2 * Math.PI);
context.closePath();
context.fill();
// context.stroke();


for (var i = 0; i < 1000; i++) {
  var x = Math.random() * demo.w;
  var y = Math.random() * demo.h; 
  var scale = 0.2 + Math.random() * 0.8;
  var alpha = Math.random() * 0.3;

  var starSprite = new PIXI.Sprite(PIXI.Texture.fromCanvas(tempCanvas));
  starSprite.scale.set(scale, scale);
  demo.drawShapeGraphics.addChild(starSprite);
  starSprite.position.set(x, y);
  starSprite.alpha = alpha;
}

demo.resize(demo.w,demo.h);
demo.render();

$(window).resize(function(){
    demo.resize($(window).width(), $(window).height());
});

function update(){
    demo.render();
    requestAnimationFrame(update);
}
requestAnimationFrame(update);

// TweenLite.to(demo.camera, 2, { zoom: 2, x: 600, y: 600 });
