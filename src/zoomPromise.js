
var Promise = require("bluebird");

module.exports.Delay = function(time, progressInterval) {
  var d = Promise.defer(); // it is better to use: return new Promise(function(resolve, reject) {})

  var timePassed = 0;
  var intervalId = 0;
  if (progressInterval) {
    intervalId = setInterval(function() {
      timePassed += progressInterval;
      d.progress((timePassed / time) * 100 + '%');
    }, progressInterval);
  }

  setTimeout(function() {
    clearInterval(intervalId);
    d.resolve('oh yeah');
  }, time);

  return d.promise;
};
