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
        app: 'app',
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
					src : ['.tmp', '<%= conf.dist %>/*', '!<%= conf.dist %>/.git*']
				}]
			},
		},

        watch: {
            javascript: {
                files: ['<%= conf.app %>/scripts/**/*.js'],
                tasks: []
            },
            sass: {
                files: ['<%= conf.app %>/styles/{,*/}*.{scss,sass}'],
                tasks: ['sass', 'autoprefixer']
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
                    '{.tmp,<%= conf.app %>}/scripts/{,*/}*.js',
                    '{.tmp,<%= conf.app %>}/styles/{,*/}*.css',
                    '<%= conf.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
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
					src    : [ '*.{ico,png,txt}', '.htaccess', 'images/{,*/}*.webp', '{,*/}*.html', 'styles/fonts/{,*/}*.*' ]
				}]
			},
			styles : {
				expand : true,
				dot    : false,
				cwd    : '<%= paths.app %>/styles',
				dest   : '.tmp/styles/',
				src    : '{,*/}*.css'
			}
		},

        processhtml: {
            dist: {
                files: [
                    {expand: true, cwd: config.app, src: ['**/*.html', '!bower_components/**/*.html'], dest: '.tmp'}
                ]
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
                    cwd: 'app/css',
                    src: ['*.css', '!*.min.css'],
                    dest: 'dist/css',
                    ext: '.min.css'
            }]
          }
        },
        concat: {
            options: {
              separator: ';',
            },
            dist: {
              src: ['app/js/*.js', 'app/js/**/*.js', 'bower_components/angular/angular.min.js', 'bower_components/jquery/dist/jquery.min.js', 'bower_components/jquery-nicescroll/jquery.nicescroll.min.js' , 'bower_components/bootstrap/dist/js/bootstrap.min.js'],
              dest: 'dist/js/main.js',
            },
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
        'processhtml',
        'concat',
        'cssmin',
        // 'uglify',		
        'copy:dist'
    ]);

};