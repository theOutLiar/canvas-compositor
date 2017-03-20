'use strict';

var gulp = require('gulp');
var gutil = require('gutil');

var babelify = require('babelify');
var browserify = require('browserify');

var sourcemaps = require('gulp-sourcemaps');

var buffer = require('vinyl-buffer'); //vinyl dependencies for ensuring browserify/babelify output to buffer
var source = require('vinyl-source-stream'); //would rather have these deps in a plugin...

gulp.task('js', () => {
    browserify({
            debug: true,
        extensions: ['.es6']
        }).require('./src/CanvasCompositor', {
            expose: 'canvas-compositor'
        })
        .transform(babelify, {
            presets: ['es2015']
        })
        .bundle()
        .on('error', function (e) {
            gutil.log(e);
            this.emit('end');
        })
        .pipe(source('canvas-compositor.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(sourcemaps.write('./', {
            sourceRoot: 'source'
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('build', ['js']);

gulp.task('watch', () => {
    gulp.watch(['src/**/*.es6'], ['js']);
});

gulp.task('dev', ['build', 'watch']);
