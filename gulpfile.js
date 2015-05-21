var gulp = require('gulp'),
    connect = require('gulp-connect'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    less = require('gulp-less'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    minifyCSS = require('gulp-minify-css'),
    path = require('path'),
    gutil = require('gulp-util'),
    del = require('del'),
    webpack = require('webpack'),
    port = process.env.port || 5000;

var env_prod = process.env.NODE_ENV === 'production';

// Clean output directory
gulp.task('clean', del.bind(
  null, ['dist/*', '!dist/.git'], {dot: true}
));

gulp.task('webpack_compile',function(){
    webpack(require(env_prod ? './webpack.production.config' : './webpack.config'), gutil.log);
});

gulp.task('copy_html', function(){
    gulp.src(['./src/**/*.html'])
    .pipe(gulp.dest('./dist'));
});

// live reload 
gulp.task('connect',function(){
    connect.server({
        root: './dist',
        port: port,
        livereload: true,
    })
})

// reload
gulp.task('reload',function(){
    gulp.src(['./dist/**/*'])
    .pipe( connect.reload() )
});

gulp.task('watch',function(){
    gulp.watch('./dist/**/*',['reload']);
    gulp.watch(['./src/js/**/*.js', './src/js/**/*.jsx', './src/less/**/*.less' ],['webpack_compile']);
    gulp.watch(['./src/**/*.html'],['copy_html']);
})

gulp.task('libs_compile', function(){
    webpack(require('./webpack.libs.config'), gutil.log); 
});

gulp.task('prepare', ['clean', 'libs_compile']);

gulp.task('default',['prepare', 'webpack_compile', 'copy_html']);

gulp.task('serve',['prepare', 'webpack_compile', 'copy_html', 'connect','watch']);
