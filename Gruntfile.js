module.exports = function(grunt) {
    'use strict';

    // Project configuration.
    //neco
    grunt.initConfig({
        meta : {
            specs : ['spec/**/*.js'],
            src: 'src/**/*.js',
            example: 'example/**/*.js',
            files: ['Gruntfile.js', '<%= meta.src %>', '<%= meta.specs %>', '<%= meta.example %>'],
            bin : {
                coverage: 'bin/coverage'
            }
        },
        jasmine: {
            src: '<%= meta.src %>',
            options: {
                specs: '<%= meta.specs %>',
                template: require('grunt-template-jasmine-istanbul'),
                templateOptions: {
                    coverage: '<%= meta.bin.coverage %>/coverage.json',
                    report: [
                        {
                            type: 'html',
                            options: {
                                dir: '<%= meta.bin.coverage %>/html'
                            }
                        },
                        {
                            type: 'lcov',
                            options: {
                                dir: '<%= meta.bin.coverage %>/lcov'
                            }
                        }
                    ],
                    template: require('grunt-template-jasmine-requirejs'),
                    templateOptions: {
                        requireConfig: {
                            baseUrl: 'src/'
                        }
                    }
                }    
            }
        },
        jshint: {
            all: '<%= meta.files %>',
            options: {
                jshintrc: '.jshintrc'
            }
        },
        watch: {
            files: '<%= meta.files %>',
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
