'use strict';

var gulp = require('gulp'),
    settings  = require('./settings.json'),
    include   = require('gulp-include'),
    minifyJS  = require('gulp-minify'),
    stylus    = require('gulp-stylus'),
    prefixer  = require('gulp-autoprefixer'),
    csso      = require('gulp-csso'),
    jade      = require('gulp-jade'),
    coffee    = require('gulp-coffee'),
    rename    = require('gulp-rename'),
    fs        = require('fs'),
    gulpif    = require('gulp-if');


var PATH_TO_STYLUS = 'src/css/index.styl',
    PATH_TO_TMP    = 'src/.tmp/',
    PATH_TO_JADE   = 'src/tpl/index.jade',
    PATH_TO_COFFEE = 'src/js/index.coffee',
    PATH_TO_VENDOR = 'src/vendor/';

gulp.task('default', ['tpl'], function(){
    gulp.watch('src/**/*.*', ['tpl']);
});

gulp.task('coffee', function(){
    return gulp.src(PATH_TO_COFFEE)
        .pipe(include())
        .pipe(coffee({bare: true}).on('error', console.log))
        .pipe(gulpif(!settings.debug, minifyJS({ compress: true, noSource: true })))
        .pipe(rename('scripts.js'))
        .pipe(gulp.dest(PATH_TO_TMP));
});

gulp.task('stylus', function(){
    return gulp.src(PATH_TO_STYLUS)
        .pipe(stylus({ compress: false }))
        .pipe(prefixer(['> 0%']))
        .pipe(csso({ restructure: true, beautify: true }))
        .pipe(rename('styles.css'))
        .pipe(gulp.dest(PATH_TO_TMP));
});

gulp.task('tpl', ['stylus', 'coffee'], function() {
    var scripts = false,
        styles = false;

    try {
        scripts = fs.readFileSync(PATH_TO_TMP + '/scripts.js', 'utf8');
    } catch(e) {}

    try {
        styles = fs.readFileSync(PATH_TO_TMP + '/styles.css', 'utf8');
    } catch(e) {}

    return gulp.src(PATH_TO_JADE)
        .pipe(jade({
            locals: {
                __scripts: scripts,
                __styles: styles
            },
            pretty: (!settings.debug) ? false : '    '
        }))
        .pipe(rename({extname:'.html'}))
        .pipe(gulp.dest('./'));
});