module.exports = function(grunt){
    'use strict';

    require('time-grunt')(grunt);

    grunt.initConfig({
        requirejs: {
            build: {
                options: {
                    optimize:'uglify2',
                    mainConfigFile: 'config.js',
                    preseveLicenseComments: true,
                    include: ['index'],
                    out: 'dist/canvas-compositor.min.js'
                }
            },
            test: {
                options: {
                    optimize: 'none',
                    mainConfigFile: 'config.js',
                    name: 'node_modules/almond/almond',
                    preserveLicenseComments: true,
                    include: ['index'],
                    out: 'dist/canvas-compositor.js'
                }
            }
        },
        clean: {
            all: ['dist']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('test', [
        'clean',
        'requirejs:test'
    ]);

    grunt.registerTask('build', [
        'clean',
        'requirejs:build'
    ]);

    grunt. registerTask('default', ['build']);
};
