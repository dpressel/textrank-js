'use strict';

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        clean: {
            dist: ['.tmp', 'dist/*'],
            server: '.tmp'
        },
        uglify: {
            my_target: {
                files: {
                    'dist/textrank.min.js': ['index.js']
                }
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'lib/*.js'
            ]
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec'
                },
                src: ['test/*.js']
            }
        }
    });

    grunt.registerTask('test', [
        'clean',
        'mochaTest'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'uglify'
    ]);

    grunt.registerTask('default', [
        'jshint',
        'test',
        'build'
    ]);
};

