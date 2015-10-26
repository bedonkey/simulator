// Generated on 2014-02-03 using generator-webapp 0.4.7
'use strict';

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    var options = {
        // Project settings
        paths: {
           // Configurable paths
           app: 'app',
           dist: 'dist'
        }	
    };

    // Define the configuration for all the tasks
    grunt.initConfig({
        clean  : {
			dist : {
			       files : [{
					dot : true,
					src : ['.tmp', '<%= paths.dist %>/*', '!<%= paths.dist %>/.git*']
				}]
			},
		},
        copy : {
			dist : {
				files : [ {
					expand : true,
					dot    : false,
					cwd    : '<%= paths.app %>',
					dest   : '<%= paths.dist %>',
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
		/**
         * Server
         */
        open: {
            app: {
                path: 'http://localhost:<%= connect.options.port %>/index.html'
            },
            dist: {
                path: 'http://<%= connect.options.hostname %>:<%= connect.options.port %>/index.html'
            },
            report: {
                path: 'docs/complexity/index.html'
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
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, yeomanConfig.app)
                        ];
                    }
                }
            },
            test: {
                options: {
                    hostname: '127.0.0.1',
                    port: 9999,
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, '.tmp'),
                            mountFolder(connect, yeomanConfig.app)
                        ];
                    }
                }
            },
            dist: {
                options: {
                    middleware: function (connect) {
                        return [
                            mountFolder(connect, yeomanConfig.thisDist)
                        ];
                    }
                }
            }
        }

    });

    grunt.registerTask('build', [
        'clean:dist',
        'concat',
        'uglify',		
        'copy:dist',
        'server'
    ]);

};