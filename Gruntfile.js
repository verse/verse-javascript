module.exports = function(grunt) {
    'use strict';

    // Project configuration.
    //neco
    grunt.initConfig({
        jasmine: {
            src: 'src/**/*.js',
            options: {
                specs: 'spec/**/*.js',
                template: require('grunt-template-jasmine-requirejs'),
                templateOptions: {
                    requireConfig: {
                        baseUrl: 'src/'
                    }
                }
            }
        },
        jshint: {
            all: [
                'Gruntfile.js',
                'src/**/*.js',
                'spec/**/*.js'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        watch: {
            files: ['Gruntfile.js', 'src/**/*.js', 'spec/**/*.js'],
            tasks: ['default']
        },
        requirejs: {
            standalone: {
                options: {
                    baseUrl: './src/',
                    name: '../bower_components/almond/almond',
                    include: ['verse'],
                    insertRequire: ['verse'],
                    out: 'build/verse.standalone.min.js',
                    findNestedDependencies: true,
                    mainConfigFile: 'src/main-config.js',
                    wrap: {
                        startFile: 'src/start.frag',
                        endFile: 'src/end.frag'
                    },
                    optimize: "uglify",
                    uglify: {
                        toplevel: true,
                        ascii_only: true,
                        beautify: false,
                        max_line_length: 1000,

                        //Skip the processor.ast_mangle() part of the uglify call (r.js 2.0.5+)
                        no_mangle: true
                    }
                }
            },
            amd: {
                options: {
                    baseUrl: './src/',
                    include: ['verse'],
                    insertRequire: ['verse'],
                    out: 'build/verse.amd.min.js',
                    wrap: true,
                    findNestedDependencies: true,
                    mainConfigFile: 'src/main-config.js',
                    optimize: "uglify",
                    uglify: {
                        toplevel: true,
                        ascii_only: true,
                        beautify: false,
                        max_line_length: 1000,

                        //Skip the processor.ast_mangle() part of the uglify call (r.js 2.0.5+)
                        no_mangle: true
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-requirejs');

    grunt.registerTask('test', ['jshint', 'jasmine']);

    grunt.registerTask('default', ['test']);

};
