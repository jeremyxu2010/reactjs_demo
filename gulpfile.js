var gulp = require('gulp'),
    connect = require('gulp-connect'),
    browserify = require('browserify'),
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
    port = process.env.port || 5000;

var env_prod = process.env.NODE_ENV === 'production';

// Clean output directory
gulp.task('clean', del.bind(
  null, ['dist/*', '!dist/.git'], {dot: true}
));

gulp.task('browserify',function(){
    browserify({
        entries: './app/js/demo2.js',
        debug: !env_prod,
        transform: ['reactify', 'envify']
    })
    .bundle()
    .pipe(source('demo2.js'))
    .pipe(buffer())
    .pipe(gulpif(!env_prod, sourcemaps.init({loadMaps: !env_prod})))
    .pipe(gulpif(env_prod, uglify().on('error', gutil.log)))
    .pipe(gulpif(!env_prod, sourcemaps.write('./maps')))
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('less', function(){
    gulp.src(['./app/less/demo2.less'], {base: './'})
    .pipe(gulpif(!env_prod, sourcemaps.init({loadMaps: !env_prod})))
    .pipe(less({
      paths: [ path.join(__dirname, './app/less/includes') ],
    }))
    .pipe(autoprefixer().on('error', gutil.log))
    .pipe(gulpif(env_prod, minifyCSS().on('error', gutil.log)))
    .pipe(gulpif(!env_prod, sourcemaps.write('./maps')))
    .pipe(gulp.dest('./dist/css'));
});

// live reload 
gulp.task('connect',function(){
    connect.server({
        port: port,
        livereload: true,
    })
})

// reload Js 
gulp.task('js',function(){
    gulp.src('./dist/**/*.js')
    .pipe( connect.reload() )
})

// reload Css 
gulp.task('css',function(){
    gulp.src('./dist/**/*.css')
    .pipe( connect.reload() )
})

// reload Html 
gulp.task('html',function(){
    gulp.src(['./*.html', './app/**/*.html'])
    .pipe( connect.reload() )
});

gulp.task('watch',function(){
    gulp.watch('./dist/**/*.js',['js']);
    gulp.watch('./dist/**/*.css',['css']);
    gulp.watch(['./*.html', './app/**/*.html'],['html']);
    gulp.watch('./app/js/**/*.js',['browserify']);
    gulp.watch('./app/less/**/*.less',['less']);
})

gulp.task('default',['browserify', 'less']);

gulp.task('serve',['browserify', 'less', 'connect','watch']);
