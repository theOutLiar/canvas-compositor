module.exports = function (grunt) {
	'use strict';

	grunt.initConfig({
        jshint: {
			build: ['**/*.js', '!dist/**/*', '!node_modules/**/*', '!bower_components/**/*']
		},
		requirejs: {
			build: {
				options: {
					optimize: 'none',
					name: 'bower_components/almond/almond',
					mainConfigFile: 'config.js',
					preserveLicenseComments: true,
					include: ['canvas-compositor'],
					out: 'dist/canvas-compositor.js',
					wrap: {
						startFile: 'amd-wrapper.start',
						endFile: 'amd-wrapper.end'
					}
				}
			},
			minify: {
				options: {
					optimize: 'uglify2',
					name: 'bower_components/almond/almond',
					mainConfigFile: 'config.js',
					preserveLicenseComments: true,
					include: ['canvas-compositor'],
					out: 'dist/canvas-compositor.min.js',
					wrap: {
						startFile: 'amd-wrapper.start',
						endFile: 'amd-wrapper.end'
					}
				}
			}
		},
		watch: {
			options: {
				events: ['changed', 'added', 'deleted']
			},
			requirejs: {
				files: ['*.js'],
				tasks: ['clean', 'requirejs']
			}
		},
		clean: {
			js: ['dist/*.js']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-clean');
	
	grunt.registerTask('lint', ['jshint']);

	grunt.registerTask('build', ['lint', 'clean', 'requirejs']);

	grunt.registerTask('default', ['build']);
	grunt.registerTask('dev', ['build', 'watch']);
};
