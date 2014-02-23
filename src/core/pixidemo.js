function DemoStates(){};
DemoStates.DEFAULT =            1;
DemoStates.PANNING =            2;

// var Parsecs = {};
// Parsecs.Camera = require("./camera");

/**
 * Demo using Pixi.js as renderer
 * @class PixiDemo
 * @constructor
 * @param {Object}  [options]
 * @param {Number}  options.lineWidth
 * @param {Number}  options.scrollFactor
 * @param {Number}  options.pixelsPerLengthUnit
 * @param {Number}  options.width               Num pixels in horizontal direction
 * @param {Number}  options.height              Num pixels in vertical direction
 */
function PixiDemo(options) {
    console.log('PIXI DEMO!');
    options = options || {};

    var that = this;

    var settings = {
        lineWidth : 2,
        scrollFactor : 0.1,
        pixelsPerLengthUnit : 128,
        width : 1280, // Pixi screen resolution
        height : 720,
        useDeviceAspect : true,
    };
    for (var key in options)
        settings[key] = options[key];

    if (settings.useDeviceAspect)
        settings.height = $(window).height() / $(window).width() * settings.width;

    this.settings = settings;
    //var ppu = this.pixelsPerLengthUnit =  settings.pixelsPerLengthUnit;
    //this.lineWidth =            settings.lineWidth;
    this.scrollFactor =         settings.scrollFactor;

    this.state = DemoStates.DEFAULT;

    // Demo.call(this,world);
};
// PixiDemo.prototype = Object.create(Demo.prototype);

/**
 * Initialize the renderer and stage
 */
PixiDemo.prototype.init = function() {
    var w = this.w,
        h = this.h,
        s = this.settings;

    var that = this;

    var renderer =  this.renderer =     PIXI.autoDetectRenderer(s.width, s.height);
    var stage =     this.stage =        new PIXI.DisplayObjectContainer();
    var container = this.container =    new PIXI.Stage(0xFFFFFF);
    document.body.appendChild(this.renderer.view);
    $(this.renderer.view).on("contextmenu", function(e) {
        return false;
    });

    this.container.addChild(stage);

    // Graphics object for drawing shapes
    this.drawShapeGraphics = new PIXI.Graphics();
    stage.addChild(this.drawShapeGraphics);

    // Graphics object for contacts
    this.contactGraphics = new PIXI.Graphics();
    stage.addChild(this.contactGraphics);

    // this.camera = new Parsecs.Camera();
    // this.camera.zoomFactor = this.settings.scrollFactor;

    stage.position.x = renderer.width / 2; // center at origin
    stage.position.y = -renderer.height / 2;

    var lastX, lastY, lastMoveX, lastMoveY, startX, startY, down = false;

    container.mousedown = function(e) {
        lastX = e.global.x;
        lastY = e.global.y;
        startX = stage.position.x;
        startY = stage.position.y;
        down = true;
        lastMoveX = e.global.x;
        lastMoveY = e.global.y;

        that.lastMousePos = e.global;

        that.handleMouseDown();
    };
    container.mousemove = function(e) {
        if (down && that.state == DemoStates.PANNING) {
            stage.position.x = e.global.x - lastX + startX;
            stage.position.y = e.global.y - lastY + startY;
        }
        lastMoveX = e.global.x;
        lastMoveY = e.global.y;

        that.lastMousePos = e.global;
    };
    container.mouseup = function(e) {
        down = false;
        lastMoveX = e.global.x;
        lastMoveY = e.global.y;

        that.lastMousePos = e.global;

        that.handleMouseUp();
    };

    $(window).bind('mousewheel', function(e) {
        var stage = that.stage;
        // var zoomFactor = that.camera.zoomFactor;
        var zoom = (e.originalEvent.wheelDelta >= 0 ? that.scrollFactor : -that.scrollFactor);
        // that.camera.zoom += (1 + zoom);

        // Zoom in/out
        stage.scale.x *= (1 + zoom);
        stage.scale.y *= (1 + zoom);
        stage.position.x += (zoom) * (stage.position.x - lastMoveX);
        stage.position.y += (zoom) * (stage.position.y - lastMoveY);
       
        stage.updateTransform();
    });
};

PixiDemo.prototype.handleMouseDown = function() {
    switch (this.state) {
        case DemoStates.DEFAULT:
            this.setState(DemoStates.PANNING);
            break;
    }
};

PixiDemo.prototype.handleMouseUp = function() {
    switch (this.state) {
        case DemoStates.DEFAULT:
            break;
        case DemoStates.PANNING:
            this.setState(DemoStates.DEFAULT);
            break;
    }
};

PixiDemo.prototype.setState = function(s) {
    this.state = s;
    // this.stateChangeEvent.state = s;
    // this.emit(this.stateChangeEvent);
};

PixiDemo.prototype.render = function() {
    this.renderer.render(this.container);
};

PixiDemo.prototype.resize = function(w, h) {
    var renderer = this.renderer;
    var view = renderer.view;
    view.style.position = "absolute";

    var ratio = w / h;
    var pixiRatio = renderer.width / renderer.height;

    if (ratio > pixiRatio) { // Screen is wider than our renderer
        view.style.height = h + "px";
        view.style.width =  (h * pixiRatio) +"px";
        view.style.left = ((w - h * pixiRatio) / 2 ) + "px";
    } else { // Screen is narrower
        view.style.height =  (w / pixiRatio) +"px";
        view.style.width = w + "px";
        view.style.top = ((h - w / pixiRatio) / 2 ) + "px";
    }
};

module.exports = PixiDemo;
