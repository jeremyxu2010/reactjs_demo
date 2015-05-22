var gulp = require('gulp'),
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
    path = require('path'),
    gutil = require('gulp-util'),
    del = require('del'),
    webpack = require('webpack'),
    port = process.env.port || 5000;

var env_prod = process.env.NODE_ENV === 'production';

// Clean output directory
gulp.task('clean', function(cb){
    del(['./dist/*', '!./dist/.git'], cb);
});

gulp.task('webpack_compile', ['clean'], function(cb){
    webpack(require('./webpack.config')(env_prod), function (err, stats) {
        if(err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
            verbose: true,
            version: false,
            timings: true
        }));
        cb();
    });
});

gulp.task('copy_html', ['webpack_compile'], function(){
    gulp.src(['./src/**/*.html'])
    .pipe(gulp.dest('./dist'));
});

// live reload 
gulp.task('connect', ['copy_html'], function(){
    connect.server({
        root: './dist',
        port: port,
        livereload: true
    });
});


gulp.task('watch', ['connect'], function(){
    gulp.watch('./dist/**/*',['reload']);
    gulp.watch(['./src/js/**/*.js', './src/js/**/*.jsx', './src/less/**/*.less' ], ['webpack_compile']);
    gulp.watch(['./src/**/*.html'], ['copy_html']);
});

// reload
gulp.task('reload',function(){
    gulp.src(['./dist/**/*'])
    .pipe( connect.reload() );
});

gulp.task('default',['copy_html']);

gulp.task('serve',['watch']);
