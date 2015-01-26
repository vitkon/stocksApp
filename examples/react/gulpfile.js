'use strict';

var gulp = require('gulp');
var del = require('del');
var sass = require('gulp-sass');


var path = require('path');


// Load plugins
var $ = require('gulp-load-plugins')();
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream'),

    sourceFile = './app/scripts/app.js',

    destFolder = './demo/scripts',
    destFileName = 'app.js';



// Scripts
gulp.task('scripts', function () {
    var bundler = watchify(browserify({
        entries: [sourceFile],
        insertGlobals: true,
        cache: {},
        packageCache: {},
        fullPaths: true
    }));

    bundler.on('update', rebundle);

    function rebundle() {
        return bundler.bundle()
            // log errors if they happen
            .on('error', $.util.log.bind($.util, 'Browserify Error'))
            .pipe(source(destFileName))
            .pipe(gulp.dest(destFolder));
    }

    return rebundle();

});





// HTML
gulp.task('html', function () {
    return gulp.src('app/*.html')
        .pipe($.useref())
        .pipe(gulp.dest('demo'))
        .pipe($.size());
});

//SASS
gulp.task('sass', function () {
    gulp.src('app/styles/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('demo/styles'))
        .pipe($.size());
});

// Images
gulp.task('images', function () {
    return gulp.src('app/images/**/*')
        .pipe($.cache($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('demo/images'))
        .pipe($.size());
});



gulp.task('jest', function () {
    var nodeModules = path.resolve('./node_modules');
    return gulp.src('app/scripts/**/__tests__')
        .pipe($.jest({
            scriptPreprocessor: nodeModules + '/gulp-jest/preprocessor.js',
            unmockedModulePathPatterns: [nodeModules + '/react']
        }));
});



// Clean
gulp.task('clean', function (cb) {
    cb(del.sync(['demo/styles', 'demo/scripts', 'demo/images']));
});


// Bundle
gulp.task('bundle', ['scripts', 'bower'], function(){
    return gulp.src('./app/*.html')
               .pipe($.useref.assets())
               .pipe($.useref.restore())
               .pipe($.useref())
               .pipe(gulp.dest('demo'));
});

// Webserver
gulp.task('serve', function () {
    gulp.src('./demo')
        .pipe($.webserver({
            livereload: true,
            port: 9000
        }));
});

// Bower helper
gulp.task('bower', function() {
    gulp.src('app/bower_components/**/*.js', {base: 'app/bower_components'})
        .pipe(gulp.dest('demo/bower_components/'));

});

gulp.task('json', function() {
    gulp.src('app/scripts/json/**/*.json', {base: 'app/scripts'})
        .pipe(gulp.dest('demo/scripts/'));
});

// Robots.txt and favicon.ico
gulp.task('extras', function () {
    return gulp.src(['app/*.txt', 'app/*.ico'])
        .pipe(gulp.dest('demo/'))
        .pipe($.size());
});

// Watch
gulp.task('watch', ['html', 'bundle', 'sass', 'serve'], function () {

    // Watch .json files
    gulp.watch('app/scripts/**/*.json', ['json']);

    // Watch .html files
    gulp.watch('app/*.html', ['html']);

    gulp.watch('app/styles/*.scss', ['sass']);





    // Watch image files
    gulp.watch('app/images/**/*', ['images']);
});

// Build
gulp.task('build', ['html', 'bundle', 'sass', 'images', 'extras']);

// Default task
gulp.task('default', ['clean', 'build', 'jest' ]);
