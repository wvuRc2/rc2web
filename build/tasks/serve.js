var gulp = require('gulp');
var browserSync = require('browser-sync');
var url = require('url');
var httpProxy = require('http-proxy');

// this task utilizes the browsersync plugin
// to create a dev server instance
// at http://localhost:9000
gulp.task('serve', ['build'], function(done) {
	var proxyOptions = {target:"http://barney.stat.wvu.edu:8088/"};
	var proxy = httpProxy.createProxyServer(proxyOptions);
	var proxyMiddleware = function(req, res, next) {
		console.log('proxy considering:' + req.url);
		if (req.url.indexOf('/api') != -1) {
			console.log('using proxy');
			req.url = req.url.substring(5);
			return proxy.web(req, res);
		} else {
			next();
		}
	};
	proxy.on('error', function(err, req, res) {
		console.log("proxy error: " + err);
	});
	proxy.on('proxyRes', function(res, req) {
		console.log("proxy resolved url:" + res);
	});
	console.log("starting server");
	browserSync({
		open: false,
		port: 9000,
		server: {
			baseDir: ['.'],
			middleware: [ 
				function (req, res, next) {
					if (req && res && next)
						proxyMiddleware(req, res, next);
				},
				function (req, res, next) {
					console.log("adding acces conrl");
					res.setHeader('Access-Control-Allow-Origin', '*');
					next();
				}]
		}
	}, done);
});
