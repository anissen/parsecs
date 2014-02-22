
## parsecs
**P**retty **A**wesome & **R**eally **S**hiny **E**ntity-**C**omponent-**S**ystem Game Framework

# TODO
* Make an EntityRepository: https://github.com/jokeofweek/jsrogue/blob/master/assets/repository.js
* Systems being able to listen and act on events: https://github.com/lmorchard/parsec-patrol/blob/7d2f01eae28d8c687fb4e97a556e0c4a05a87ef4/app/scripts/worlds.coffee#L38

## Notes
* DAT-gui
* FPS-meter
* Pause/unpause
* Make a gameloop.js (?)
* Termonology:
    - Entity -> Entity
    - Component -> Attribute
    - System -> System
* Factory/repository methods for creating Entities w. Attributes
* Use Promises for callbacks (e.g. Q, bluebird)
    - http://greweb.me/2014/01/promisify-your-games/
    - http://greweb.me/2013/07/deferred/
* Steering? (http://gamedevelopment.tutsplus.com/series/understanding-steering-behaviors--gamedev-12732)
* Promise-based behavior trees? (ref. http://takinginitiative.wordpress.com/2014/02/17/synchronized-behavior-trees/ ?)
* Rule/trigger-system (use for e.g. achievements, game logic, etc.)
* Plug-in structure:
```
var MyLib = function(plugins) {
  for (var name in plugins) {
    var value = plugins[name];
    MyLib.plugins[name](value);
  }
};
MyLib.plugins = {}
MyLib.plugins.baz = function(value) {
  console.log('baz plugin initialized called with value', value);
};

var myLib = new MyLib({ baz: { 'stuff': 'here' } });
```
(see https://github.com/markdalgleish/bespoke.js/blob/master/src/bespoke.js#L89)

## Planetarium libraries: (https://github.com/anissen/planetarium/blob/master/lib/planets/planetarium.coffee)
* Random
* Tween
* Touch input
* Keyboard input
* Lightbox (Magnific-Popup?)
* Fullscreen
* Mobile?
* Procedural sky rendering: https://github.com/wwwtyro/procedural.js

## Libraries:
* Random: seed-random
* Rendering: Pixi
* Audio: Howler
* Tween: Greensock
* Resource loader: ? (PxLoader?)
* Physics: p2.js (?)
* Touch input: hammer.js (?)
* Keyboard input: keypress, https://github.com/ccampbell/mousetrap,  (?)
* Fullscreen: screenfull.js (https://github.com/sindresorhus/screenfull.js)
* Cross platform: Cocoon.js (?)
* State manager: https://github.com/jakesgordon/javascript-state-machine (?)
* Storage: https://github.com/mozilla/localForage ?
* Network: Cloak (?), Primus (?)
* Vibration?
* GLSL transitions?
* Offline
* Stats: https://github.com/spite/rstats
* Color manipulation library?
    * https://github.com/bgrins/TinyColor ?
    * https://github.com/mbjordan/Colors ?
    * https://github.com/harthur/color ?
    * https://github.com/gka/chroma.js ?
* Analytics: ?

## Stupid ideas
* Behavior tree as an Entity-Component-System 

