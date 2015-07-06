module.exports = function(grunt) {
    grunt.initConfig({
        clean: ['build'],
        copy: {
            main: {
                files: [{
                    expand: true,
                    src: ['app/*'],
                    dest: 'build/',
                    flatten: true
                }]
            }
        },
        replace: {
            main: {
                src: ['build/**/*'],
                overwrite: true,
                replacements: [{
                    from: /API_BASE_URL: '' \/\/Autowired from Grunt/g,
                    to: grunt.option("api-base-url") ? 'API_BASE_URL: \'' + grunt.option('api-base-url') + '\'' : 'API_BASE_URL: \'\''
                }]
            }
        },
        connect: {
            server: {
                options: {
                    port: grunt.option('port') ? grunt.option('port') : 8000,
                    base: "app",
                    keepalive: true,
                    middleware: function (connect, options) {
                        var proxy = require("grunt-connect-proxy/lib/utils").proxyRequest;
                        return [
                            proxy,
                            connect.static("app"),
                            connect.directory("app")
                        ];
                    }
                },
                proxies: [{
                    context: "/api",
                    host: grunt.option("proxy.host") ? grunt.option("proxy.host") : "localhost",
                    port: grunt.option("proxy.port") ? grunt.option("proxy.port") : 8080,
                    https: false,
                    xforward: false
                }, {
        		    host: grunt.option("proxy.host") ? grunt.option("proxy.host") : "localhost",
        		    port: grunt.option("proxy.port") ? grunt.option("proxy.port") : 8080,
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

    
    grunt.registerTask('default', [ 'clean', 'copy:main', 'replace:main' ]);

    grunt.registerTask('server', [ 'configureProxies:server', 'connect:server' ]);
};
