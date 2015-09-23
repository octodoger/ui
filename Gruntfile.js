module.exports = function(grunt) {
    grunt.initConfig({
        clean: {
            main: ['build']
        },
        exec: {
            bower: {
                cmd: "node node_modules/.bin/bower install --force"
            }
        },
        copy: {
            main: {
                files: [{
                    expand: true,
                    src: ['app/index.html'],
                    dest: 'build/',
                    flatten: true
                }, {
                    expand: true,
                    src: ['app/style/*'],
                    dest: 'build/style/',
                    flatten: true
                }, {
                    expand: true,
                    src: ['app/partial/*'],
                    dest: 'build/partial/',
                    flatten: true
                }]
            }
        },
        replace: {
            main: {
                src: ['build/hqcode.js'],
                overwrite: true,
                replacements: [{
                    from: /API_BASE_URL: '' \/\/Autowired from Grunt/g,
                    to: grunt.option('api-base-url') ? 'API_BASE_URL: \'' + grunt.option('api-base-url') + '\'' : 'API_BASE_URL: \'\''
                }]
            }
        },
        concat: {
            main: {
              src: ['app/script/**/*.js'],
              dest: 'build/hqcode.js',
            },
        },
        connect: {
            server: {
                options: {
                    port: grunt.option('port') ? grunt.option('port') : 8000,
                    base: 'build',
                    keepalive: true,
                    middleware: function (connect, options) {
                        var proxy = require('grunt-connect-proxy/lib/utils').proxyRequest;
                        return [
                            proxy,
                            connect.static('build'),
                            connect.directory('build')
                        ];
                    }
                },
                proxies: [{
                    context: '/api',
                    host: grunt.option('proxy.host') ? grunt.option('proxy.host') : 'localhost',
                    port: grunt.option('proxy.port') ? grunt.option('proxy.port') : 8080,
                    https: false,
                    xforward: false
                }, {
        		    host: grunt.option('proxy.host') ? grunt.option('proxy.host') : 'localhost',
        		    port: grunt.option('proxy.port') ? grunt.option('proxy.port') : 8080,
        		    https: false,
        		    xforward: false
	            }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-text-replace');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-connect-proxy');
    grunt.loadNpmTasks('grunt-exec');
    grunt.loadNpmTasks('grunt-contrib-concat');


    grunt.registerTask('build', [ 'clean', 'copy', 'concat', 'replace:main', 'exec:bower' ]);

    grunt.registerTask('default', [ 'build' ]);

    grunt.registerTask('server', [ 'build', 'configureProxies:server', 'connect:server' ]);
};
