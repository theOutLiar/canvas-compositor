'use strict';

var gulp = require('gulp');
var gutil = require('gutil');

var babelify = require('babelify');
var browserify = require('browserify');

var sourcemaps = require('gulp-sourcemaps');

let mkdirp = require('mkdirp');

var buffer = require('vinyl-buffer'); //vinyl dependencies for ensuring browserify/babelify output to buffer
var source = require('vinyl-source-stream'); //would rather have these deps in a plugin...

let fs = require('fs');
let path = require('path');

gulp.task('js', (done) => {
    mkdirp('dist', function (err) {
        if (err) {
            gutil.log(err);
        }
        browserify({
                entries: ['src/CanvasCompositor'],
                standalone: 'CanvasCompositor',
                debug: true
            })
            .transform(babelify, {
                presets: ['@babel/env']
            })
            .bundle()
            .on('error', gutil.log)
            .pipe(fs.createWriteStream(path.join(__dirname, 'dist', 'canvas-compositor.js'), {
                encoding: 'utf-8'
            }));
    });
    return done();
});

gulp.task('build', gulp.task('js'));

gulp.task('watch', (done) => {
    gulp.watch(['src/**/*'], ['js']);
    return done();
});

gulp.task('dev', gulp.series(['build', 'watch']));
