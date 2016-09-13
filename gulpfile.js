'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var rimraf = require('rimraf');
var openURL = require('open');
var lazypipe = require('lazypipe');

//app directory structure
var tofu = {
  src: /*require('./bower.json').appPath ||*/ 'src',
  dist: 'dist',
  temp: '.tmp',
  test: 'test'
};

// for sources
var paths = {
  scripts: [tofu.src + '/**/*.js']
}

//Lazy pipes
var lintScripts = lazypipe()
  .pipe($.jshint) // '.jshintrc'
  .pipe($.jshint.reporter,'jshint-stylish' );

gulp.task('serve', function (cb) {
  runSequence(
    'clean:tmp',
    //['bower'],
    ['lint:scripts'],
    ['start:client'],
    'watch', cb);
});

gulp.task('watch', function () {
  $.watch(paths.scripts)
    .pipe($.plumber())
    .pipe(lintScripts())
    .pipe($.connect.reload())
});

gulp.task('start:client', ['start:server', 'lint:scripts'], function () {
  openURL('http://localhost:9001');
});

gulp.task('start:server', function() {
  $.connect.server({
    root:[tofu.temp, tofu.src],
    livereload:true,
    port: 9001,
    middleware:function(connect, opt){
      return [['/bower_components', 
        connect["static"]('./bower_components')]]
    }
  });
});

gulp.task('lint:scripts', function() {
    console.log("todo");
});

gulp.task('clean:tmp', function (cb) {
  rimraf(tofu.temp, cb);
});