module.exports = function(grunt) {
    grunt.initConfig({
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
                    port: grunt.option("proxy.port") ? grunt.option("proxy.port") : 3000,
                    https: false,
                    xforward: false
                }, {
		    host: grunt.option("proxy.host") ? grunt.option("proxy.host") : "localhost",
		    port: grunt.option("proxy.port") ? grunt.option("proxy.port") : 3000,
		    https: false,
		    xforward: false
	        }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-connect-proxy');

    grunt.registerTask('server', [ 'configureProxies:server', 'connect:server' ]);
};
