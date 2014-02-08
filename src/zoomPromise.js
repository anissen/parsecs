
var Q = require('Q');

module.exports.Delay = function(time, progressInterval) {
  var d = Q.defer();

  /*
  var img = new Image();
  img.onload = function() {
    d.resolve(img);
  };
  img.onabort = function(e) {
    d.reject(e);
  };
  img.onerror = function(err) {
    d.reject(err);
  };
  img.src = url;
  */
  var timePassed = 0;
  var intervalId = 0;
  if (progressInterval) {
    intervalId = setInterval(function() {
      timePassed += progressInterval;
      d.notify((timePassed / time) * 100 + '%');
    }, progressInterval);
  }

  setTimeout(function() {
    console.log('time passed: ', timePassed);
    clearInterval(intervalId);
    d.resolve('oh yeah');
  }, time);

  return d.promise;
};


