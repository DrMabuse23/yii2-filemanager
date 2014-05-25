module.exports = function (grunt) {
    'use strict';

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        bumpup: ['package.json', 'composer.json','bower.json'],

        release: {
            options: {
                bump: false, //default: true
                tagName: 'v<%= version %>', //default: '<%= version %>'
                commitMessage: 'release v<%= version %>', //default: 'release <%= version %>'
                tagMessage: 'tagging version v<%= version %>' //default: 'Version <%= version %>'
            }
        },

        replace: {
            readme: {
                src: ['README.md'],
                overwrite: true,
                replacements: [
                    {
                        from: /Version \d{1,1}\.\d{1,2}\.\d{1,2}/g,
                        to: 'Version <%= pkg.version %>'
                    }
                ]
            },
            home_php: {
                src: ['FileManagerModule.php'],
                overwrite: true,
                replacements: [
                    {
                        from:/\d{1,1}\.\d{1,2}\.\d{1,2}/g,
                        to: '<%= pkg.version %>'
                    }
                ]
            }
        },
        sass: {                              // Task
            applicationCss: {
                options: {                       // Target options
                    style: 'expanded'
                },
                files: {                         // Dictionary of files
                    '<%= dist %>css/app.css': '<%= bundleScss %>application.scss'
                }
            },
            applicationMinCss: {
                options: {                       // Target options
                    style: 'compressed'
                },
                files: {                         // Dictionary of files
                    '<%= dist %>/css/application-<%= pkg.version %>.min.css': '<%= bundleScss %>application.scss'   // 'destination': 'source'
                }
            }
        },
        concat: {
            options: {
                stripBanners: true,
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= pkg.author %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %> */'
            },
            vendor: {

            },
            app: {

            }
        },
        clean: ["<%= dist %>"],
        watch: {
            sass: {
                files: '<%= bundleScss %>/**/*.scss',
                tasks: ['clean','sass:applicationCss','sass:applicationMinCss']
            },
            js: {
                files: '<%= bundle %>js/**/*.js',
                tasks: ['clean','concat','uglify']
            }
        },
        sprite:{
            all: {
                src:        '<%= bundle %>img/sprites/*.png',
                destImg:    '<%= dist %>img/spritesheet.png',
                destCSS:    '<%= dist %>css/sprites.css'
            }
            ,
            retina: {
                src:        'images/sprites2x/*.png',
                destImg:    'images/spritesheet@2x.png',
                destCSS:    'css/sprites2x.css'
            }
        },
        removelogging: {
            dist: {
                src: "<%= dist %>js/application-debug.js",
                dest: "<%= dist %>js/application.js",

                options: {
                    // see below for options. this is optional.
                }
            }
        },
        uglify: {
            application: {
                options: {
                    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= pkg.author %> - ' +
                    '<%= grunt.template.today("yyyy-mm-dd") %> */',
                    options: {
                        beautify: false,
                        compress:false,
                        mangle: {
                            except: ['jQuery']
                        }
                    }
                },
                files: {
                    '<%= dist %>js/app.<%= pkg.version %>.min.js': ['<%= dist %>js/application.js']
                }
            }
        },
        bundle: "web/assets/",
        bundleScss: '<%= bundle %>scss/',
        dist:"web/dist/",
        bower:"bower_components/"
    })
    ;
    grunt.loadNpmTasks('grunt-release');
    grunt.loadNpmTasks('grunt-bumpup');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks("grunt-remove-logging");
    grunt.loadNpmTasks('grunt-spritesmith');
// Default task(s).
    grunt.registerTask('default', ['watch','sass']);
    grunt.registerTask('newVersion',['clean','bumpup','replace','sass','concat','uglify','release']);

}
;