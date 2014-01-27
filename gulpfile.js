
var gulp = require('gulp');

var scripts = {
  page: 'index.html',
  main: 'scripts/game.js',
  sources: ['scripts/*.js'],
  tests: ['test/*.js']
};

var dist = './dist/';

gulp.task('lint', function() {
  var jshint = require('gulp-jshint');
  var jshintStylish = require('jshint-stylish');
  var jscs = require('gulp-jscs');

  gulp.src(sources)
    .pipe(jshint())
    .pipe(jshint.reporter(jshintStylish))
    .pipe(jscs());
});

gulp.task('start_cover', function (cb) {
  var istanbul = require("gulp-istanbul");

  gulp.src(sources)
    .pipe(istanbul())
    .on('end', cb);
});

/*
// Run tests and output reports
gulp.task('cover', function () {
  var mocha = require("gulp-mocha");
  var istanbul = require("gulp-istanbul");

  gulp.runs('start_cover', function () {
    gulp.src(testSources)
      .pipe(mocha()) // Run any unit test frameworks here
      .pipe(istanbul.writeReports());
  });
});

gulp.task('test', function () {
  var mocha = require("gulp-mocha");

  gulp.src(scripts.tests)
    .pipe(mocha({ reporter: 'spec', growl: 'true' }));
});
*/

gulp.task('dist', function() {
  var browserify = require('gulp-browserify');
  var concat = require("gulp-concat");
  var header = require("gulp-header");
  var bytediff = require('gulp-bytediff');
  var rename = require("gulp-rename");
  var uglify = require("gulp-uglify");
  var license = require('gulp-license');
  var notify = require("gulp-notify");
  
  gulp.src(scripts.main) // sources
    .pipe(browserify()) // { debug: true /* source maps */ }
    .pipe(concat('index.js'))
    .pipe(rename('bundle.js'))
    .pipe(header('/* This is a header for ${name} version ${version}! */\n', { name: 'gulp test', version: '0.0.2' } ))
    .pipe(license('MIT', { tiny: false, organization: 'Anders Nissen' }))
    .pipe(gulp.dest(dist + 'bundle'))
    .pipe(rename('bundle.min.js'))
    .pipe(bytediff.start())
    .pipe(uglify())
    .pipe(bytediff.stop())
    .pipe(header('/* This is a header for minified  ${name} version ${version}! */\n', { name: 'gulp test', version: '0.0.2' } ))
    .pipe(license('MIT', { tiny: true, organization: 'Anders Nissen' }))
    .pipe(gulp.dest(dist + 'bundle'))
    .pipe(notify({ message: 'dist task completed' }));
});

gulp.task('watch', function() {
  gulp.watch(scripts.sources, ['test']);
});

gulp.task('sloc', function(){
  var sloc = require('gulp-sloc');

  gulp.src(scripts.sources)
    .pipe(sloc());
});

gulp.task('plato', function () {
  var plato = require('gulp-plato');

  gulp.src(scripts.sources)
    .pipe(plato('report'));
});

var lr = require('tiny-lr');
var server = lr();

gulp.task('gamedev-scripts', function() {
  var browserify = require('gulp-browserify');
  var concat = require('gulp-concat');
  var livereload = require('gulp-livereload');
  
  gulp.src(scripts.main)
    .pipe(browserify())
    .pipe(concat('index.js'))
    .pipe(gulp.dest(dist + 'dev'))
    .pipe(livereload(server));
});

gulp.task('gamedev', function() {
  var port = 35729;
  server.listen(port, function(err) {
    if(err) return console.log(err);
    console.log('Listening on localhost:%s', port);
    console.log('Include <script src="http://localhost:35729/livereload.js"></script> in your HTML');

    gulp.watch([scripts.sources, scripts.page], ['gamedev-scripts']);
  });
});

gulp.task('bump', function() {
  var bump = require('gulp-bump');
  return gulp.src('package.json')
    .pipe(bump({ bump: 'patch' }))
    .pipe(gulp.dest('.'));
});

// for sequential tasks: https://github.com/OverZealous/gulp-run-sequence
// for an improved watch task use: https://github.com/floatdrop/gulp-watch

gulp.task('default', function(){
  // place code for your default task here
});
