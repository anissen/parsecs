
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
    - http://taoofcode.net/promise-anti-patterns/
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
(see https://github.com/markdalgleish/bespoke.js/blob/master/src/bespoke.js#L89, http://jsfiddle.net/anissen/3vdy4/)
* Speech synthesis support detection: `var speechSynthSupported = ('speechSynthesis' in window);`
* Got focus/lost focus: http://codepen.io/jonathan/pen/sxgJl
* Work around "require('../../../blah'))": http://lostechies.com/derickbailey/2014/02/20/how-i-work-around-the-require-problem-in-nodejs/
* Web Audio on iOS: http://paulbakaus.com/tutorials/html5/web-audio-on-ios/
* Design inspiration:
  - https://lh4.googleusercontent.com/-jj9Yd0__iOY/UwDpROfLBaI/AAAAAAAACTY/wgqMhXHPiqY/s0/codrops_collective_103B.png
  - https://lh6.googleusercontent.com/-MidJ11YeTTM/Uu36tdhbTbI/AAAAAAAACQw/qr7rrybJf-8/s0/codrops_collective_101B.png
  - http://cs322521.vk.me/v322521416/78aa/xH_nibothx0.jpg
* Rotating around a point: http://www.html5gamedevs.com/topic/4193-rotating-around-a-point/
* Audio visualization

## Planetarium libraries: (https://github.com/anissen/planetarium/blob/master/lib/planets/planetarium.coffee)
* Random
* Tween
* Touch input
* Keyboard input
* Lightbox (Magnific-Popup?)
* Fullscreen
* Mobile?
* Procedural sky rendering: https://github.com/wwwtyro/procedural.js
* Particles: (http://lonely-pixel.com/blog/making-a-particle-engine-using-javascript-part-1)
* Speech synthesis: http://codepen.io/matt-west/pen/wGzuJ, http://blog.teamtreehouse.com/getting-started-speech-synthesis-api

## Libraries:
* Architechture inspirations: https://github.com/markdalgleish/bespoke.js, https://github.com/ondras/rot.js
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
* Storage: https://github.com/mozilla/localForage ? (manager: https://github.com/AndreLion/html5-localstorage-manager)
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
* Validate components? (https://github.com/Atinux/schema-inspector)
* Replay system?

## Stupid ideas
* Behavior tree as an Entity-Component-System (reference: https://github.com/Calamari/BehaviorTree.js)

