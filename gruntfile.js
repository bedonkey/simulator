// Generated on 2014-02-03 using generator-webapp 0.4.7
'use strict';

var LIVERELOAD_PORT = 35729,
    lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT}),
    path = require('path'),
    mountFolder = function (connect, dir) {
        return connect.static(require('path').resolve(dir));
    };

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    var version = '0.1',
    config = {
        app: 'simulator',
        dist: 'dist',
        thisDist: 'dist/' + version
    };

    // Define the configuration for all the tasks
    grunt.initConfig({
        conf : config,
        clean : {
			dist : {
			       files : [{
					dot : true,
					src : ['<%= conf.dist %>/*', '!<%= conf.dist %>/.git*']
				}]
			},
		},

        watch: {
            javascript: {
                files: ['<%= conf.app %>/app/modules/**/*.js'],
                tasks: []
            },
            bower: {
                files: ['<%= conf.app %>/bower_components/**/*.js'],
                tasks: ['bower']
            },
            livereload: {
                options: {
                    livereload: LIVERELOAD_PORT
                },
                files: [
                    '<%= conf.app %>/{,*/}*.html',
                    '{<%= conf.app %>}/app/modules/{,*/}*.js',
                    '{<%= conf.app %>}/assets/css/{,*/}*.css',
                    '<%= conf.app %>/assets/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },

        copy : {
			dist : {
				files : [ {
					expand : true,
					dot    : false,
					cwd    : '<%= conf.app %>',
					dest   : '<%= conf.dist %>',
					src    : [ '*.{ico,png,txt}', '.htaccess', 'assets/images/*.{jpg,png,gif}', '{,*/}*.html', '**/{,*/}*.html', 'app/resources/**/*.robot' , 'app/resources/**/*.json']
				}]
			}
		},
		/**
         * Server
         */
        open: {
            app: {
                path: 'http://localhost:<%= connect.options.port %>/index.html'
            },
            dist: {
                path: 'http://<%= connect.options.hostname %>:<%= connect.options.port %>/index.html'
            }
        },
        connect: {
            options: {
                port: 9000,
                // change this to '0.0.0.0' to access the server from outside
                hostname: '0.0.0.0'
            },
            livereload: {
                options: {
                    middleware: function (connect) {
                        return [
                            lrSnippet,
                            mountFolder(connect, config.app)
                        ];
                    }
                }
            },
            dist: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, config.thisDist)
                        ];
                    }
                }
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'simulator/assets/css',
                    src: ['*.css'],
                    dest: 'dist/css',
                    ext: '.min.css'
                },{
                    expand: true,
                    cwd: 'simulator/bower_components/bootstrap/dist/css',
                    src: ['bootstrap.css'],
                    dest: 'dist/css',
                    ext: '.min.css'
                }]
          }
        },
        concat: {
            options: {
              separator: ';',
            },
            component: {
              src: ['simulator/app/modules/**/*.js'],
              dest: 'dist/js/modules.js',
            },
            directive: {
              src: ['simulator/app/directive/*.js'],
              dest: 'dist/js/directive.js',
            },
            utils: {
              src: ['simulator/assets/js/*.js'],
              dest: 'dist/js/utils.js',
            },
            main: {
              src: ['simulator/app/TabController.js', 'simulator/app/MainApp.js'],
              dest: 'dist/js/main.js',
            },
            jquery: {
              src: ['simulator/bower_components/jquery/dist/jquery.js'],
              dest: 'dist/js/jquery.js',
            },
            nicescroll: {
              src: ['simulator/bower_components/jquery-nicescroll/jquery.nicescroll.js'],
              dest: 'dist/js/jquery.nicescroll.js',
            },
            bootstrap: {
              src: ['simulator/bower_components/bootstrap/dist/js/bootstrap.js'],
              dest: 'dist/js/bootstrap.js',
            },
            angular: {
              src: ['simulator/bower_components/angular/angular.js'],
              dest: 'dist/js/angular.js',
            }
        },

    });

    grunt.registerTask('serve', function(target) {
        grunt.task.run([
            'connect:livereload',
            'open:app',
            'watch'
        ]);
    });

    grunt.registerTask('build', [
        'clean:dist',
        'concat',
        'cssmin',
        //'uglify',		
        'copy:dist'
    ]);

};