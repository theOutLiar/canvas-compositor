module.exports = function(grunt){
    'use strict';

    grunt.initConfig({
        requirejs: {
            build: {
                options: {
                    optimize: 'none',
                    mainConfigFile: 'config.js',
                    name: 'bower_components/almond/almond',
                    preserveLicenseComments: true,
                    include: ['index2'],
                    out: 'canvas-compositor.js'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-requirejs');

    grunt.registerTask('build', ['requirejs']);

    grunt.registerTask('default', ['build']);
};
