var gulp = require('gulp');
var config = require('./webpack.config.js');
var webpack = require('webpack');
var webpackDevServer = require('webpack-dev-server');


gulp.task('server', function () {
    var compiler = webpack(config);
    var server = new webpackDevServer(compiler, {
        hot: true,
        noInfo: true,
        publicPath: config.output.publicPath,
        historyApiFallback: true
    });
    server.listen(3000, 'localhost', function (err) {
        if(err){
            console.log(err);
        }
        console.log('Listening at http://localhost:3000!');
    })
});