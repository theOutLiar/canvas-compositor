'use strict';
let gulp = require('gulp');
let gutil = require('gulp-util');
let path = require('path');
let browserify = require('browserify');
let gls = require('gulp-live-server');
let babelify = require('babelify');
let mkdirp = require('mkdirp');
let fs = require('fs');
let injectReload = require('gulp-inject-reload');
let gopen = require('gulp-open');

let buffer = require('vinyl-buffer');
let source = require('vinyl-source-stream');

let prod = process.env.NODE_ENV === 'production';

gulp.task('browserify', () => {
    return mkdirp('dist/static/js', function (err) {
        if (err) {
            gutil.log(err);
        }
        browserify({
                entries: ['src/index'],
                standalone: 'mandelbrot',
                debug: true
            })
            .transform(babelify, {
                presets: ['es2015']
            })
            .bundle()
            .on('error', gutil.log)
            .pipe(fs.createWriteStream(path.join(__dirname, 'dist', 'index.js'), {
                encoding: 'utf-8'
            }));
    });
});

gulp.task('html', () => {
    return gulp.src('src/**/*.html')
        .pipe(prod ? gutil.noop() : injectReload())
        .pipe(gulp.dest('dist'));
});


gulp.task('build', ['browserify', 'html']);

gulp.task('dev', ['build'], () => {
    let server = gls('./index.js', {
        cwd: 'dist',
    });
    server.start();

    //wait for some stdout from server to launch browser
    server.server.stdout.on('data', (message) => {
        gutil.log(message);
        gulp.src(__filename).pipe(
            gopen({
                uri: 'http://localhost:3000'
            })
        );
    });

    gulp.watch(['src/**/*.js'], ['browserify']);
    gulp.watch(['src/**/*.html'], ['html']);

    gulp.watch(['dist/static/**/*'], (file) => {
        server.notify.apply(server, [file]);
    });
    gulp.watch(['dist/index.js', 'dist/graphics/*'], function(){
        serve.start.bind(server)();
    });
});

gulp.task('default', ['dev']);
