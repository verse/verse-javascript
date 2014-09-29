/* global requirejs, define */

module.exports = function(grunt) {
    'use strict';

    // Project configuration.
    //neco
    grunt.initConfig({
        meta: {
            package: grunt.file.readJSON('package.json'),
            specs: ['spec/**/*.js'],
            src: 'src/**/*.js',
            example: 'example/**/*.js',
            files: ['Gruntfile.js', '<%= meta.src %>', '<%= meta.specs %>', '<%= meta.example %>'],
            bin: {
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
                    report: [{
                        type: 'html',
                        options: {
                            dir: '<%= meta.bin.coverage %>/html'
                        }
                    }, {
                        type: 'lcov',
                        options: {
                            dir: '<%= meta.bin.coverage %>/lcov'
                        }
                    }, {
                        type: 'text-summary'
                    }],
                    template: require('grunt-template-jasmine-requirejs'),
                    templateOptions: {
                        requireConfig: {
                            baseUrl: 'src/',
                            // 3. pass paths of the sources being instrumented as a configuration option
                            //    these paths should be the same as the jasmine task's src
                            //    unfortunately, grunt.config.get() doesn't work because the config is just being evaluated
                            config: {
                                instrumented: {
                                    src: grunt.file.expand('src/**/*.js')
                                }
                            },
                            // 4. use this callback to read the paths of the sources being instrumented and redirect requests to them appropriately
                            callback: function() {
                                define('instrumented', ['module'], function(module) {
                                    return module.config().src;
                                });
                                require(['instrumented'], function(instrumented) {
                                    var oldLoad = requirejs.load;
                                    requirejs.load = function(context, moduleName, url) {
                                        // normalize paths
                                        if (url.substring(0, 1) === '/') {
                                            url = url.substring(1);
                                        } else if (url.substring(0, 2) === './') {
                                            url = url.substring(2);
                                        }
                                        // redirect
                                        if (instrumented.indexOf(url) > -1) {
                                            url = './.grunt/grunt-contrib-jasmine/' + url;
                                        }
                                        return oldLoad.apply(this, [context, moduleName, url]);
                                    };
                                });
                            }
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
