const { task, src, dest, watch, series, parallel } = require('gulp');
const browserSync = require('browser-sync');
const reload = browserSync.reload;
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const clean = require('gulp-clean');
const cleanCss = require('gulp-clean-css');
const concat = require('gulp-concat');
const imagemin = require('gulp-imagemin');
const cssmin = require('gulp-minify-css');
const jsmin = require('gulp-js-minify');
const notify = require( 'gulp-notify' );
const plumber = require( 'gulp-plumber');

var notifyError = function(err) {
    notify.onError({
        title: "Error in " + err.plugin,
        message:  "Error: <%= error.message %>"
    })(err);
    this.emit('end');
};

task('js:build', function(){
    return src('src/js/**/*.js')
    .pipe(plumber({errorHandler: notifyError}))
    .pipe(babel({presets: ['@babel/env']}))
    .pipe(concat('script.min.js'))
    .pipe(uglify())
    .pipe(jsmin())
    .pipe(dest('dist/js/'))
    .pipe(reload({stream: true}))
});

task('css:build', function(){
    return src('src/scss/**/style.scss')
    .pipe(plumber({errorHandler: notifyError}))
    .pipe(sass())
    .pipe(autoprefixer({
        overrideBrowserslist:  ['last 2 versions'],
        cascade: false
    }))
    .pipe(concat('style.min.css'))
    .pipe(cleanCss())
    .pipe(cssmin())
    .pipe(dest('dist/css/'))
    .pipe(reload({stream: true}))
});

task('img:build', function() {
    return src('src/img/**/*.*')
    .pipe(plumber({errorHandler: notifyError}))
    .pipe(imagemin())
    .pipe(dest('dist/img/'))
    .pipe(reload({stream: true}))
});


task('watch', function() {
    watch('./*.html', reload);
    watch('src/js/**/*.js', parallel('js:build'));
    watch('src/img/**/*.*', parallel('img:build'));
    watch('src/scss/**/*.scss', parallel('css:build'));
})

task('webserver', function () {
    browserSync({
        server: {
            baseDir: "."
        },
        tunnel: true,
        logPrefix: "step-project-forkio"
    });
});

task('clean', function () {
    return src('dist/**/*.*', {read: false})
        .pipe(clean());
});

task('build', series('clean', parallel('css:build', 'js:build', 'img:build')));
task('dev', parallel('watch', 'webserver'));