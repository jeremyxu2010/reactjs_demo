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

gulp.task('process_js',function(){
    webpack(require(env_prod ? './webpack.production.config' : './webpack.config'), gutil.log);
});

gulp.task('process_css', function(){
    gulp.src('./src/less/demo2.less')
    .pipe(gulpif(!env_prod, sourcemaps.init({loadMaps: !env_prod})))
    .pipe(less({
      paths: [ path.join(__dirname, './src/less/includes') ],
    }))
    .pipe(autoprefixer().on('error', gutil.log))
    .pipe(gulpif(env_prod, minifyCSS().on('error', gutil.log)))
    .pipe(gulpif(!env_prod, sourcemaps.write('./maps', {sourceRoot: '/source/src/less/'})))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('process_vendor_asset', function(){
    gulp.src('./node_modules/bootstrap/dist/**/*')
    .pipe(gulp.dest('./dist/vendors/bootstrap'));
});

gulp.task('process_app_asset', function(){
    gulp.src(['./src/**/*.html', './src/**/*.png', './src/**/*.jpg', './src/**/*.gif'])
    .pipe(gulp.dest('./dist'));
});

gulp.task('process_asset', ['process_vendor_asset', 'process_app_asset']);

// live reload 
gulp.task('connect',function(){
    connect.server({
        root: './dist',
        port: port,
        livereload: true,
    })
})

// reload Js 
gulp.task('reload_js',function(){
    gulp.src('./dist/**/*.js')
    .pipe( connect.reload() )
})

// reload Css 
gulp.task('reload_css',function(){
    gulp.src('./dist/**/*.css')
    .pipe( connect.reload() )
})

// reload Html 
gulp.task('reload_assets',function(){
    gulp.src(['./dist/**/*.html'])
    .pipe( connect.reload() );
});

gulp.task('watch',function(){
    gulp.watch('./dist/**/*.js',['reload_js']);
    gulp.watch('./dist/**/*.css',['reload_css']);
    gulp.watch(['./dist/**/*.html', './dist/**/*.png', './dist/**/*.jpg', './dist/**/*.gif'],['reload_assets']);
    gulp.watch(['./src/js/**/*.js', './src/js/**/*.jsx'],['process_js']);
    gulp.watch('./src/less/**/*.less',['process_css']);
    gulp.watch(['./src/**/*.html', './src/**/*.png', './src/**/*.jpg', './src/**/*.gif'],['process_asset']);
})

gulp.task('prepare', function(){
   webpack(require('./webpack.libs.config'), gutil.log); 
});

gulp.task('default',['prepare', 'process_js', 'process_css', 'process_asset']);

gulp.task('serve',['prepare', 'process_js', 'process_css', 'process_asset', 'connect','watch']);
