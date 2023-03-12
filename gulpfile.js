// Mike's Landing Page Gulp Workflow
'use strict';


// Plugins
const   gulp = require('gulp'),
        browserSync = require('browser-sync').create(),
           partials = require('gulp-inject-partials'),
            htmlmin = require('gulp-htmlmin'),
             concat = require('gulp-concat'),
             rename = require('gulp-rename'),
              clean = require('gulp-clean-css'),
               webp = require('gulp-webp'),
               maps = require('gulp-sourcemaps'),
               sass = require('gulp-sass')(require('sass'));


// File Paths
const base = './',
       src = base + 'dev',
      dest = base + 'dist',
     paths = {
           js: src + '/js/app.js' ,
          img: src + '/img/*.{jpg,png,svg,gif,ico,webp}',
         html: src + '/html/*.html',
         scss: src + '/sass/app.scss',
        fonts: src + '/fonts/*'
     };


// SASS => CSS
function css(done) {
    return gulp.src(paths.scss)
        .pipe(maps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(clean()) // for minifying the file
        .pipe(rename('styles.css'))
        .pipe(maps.write())
        .pipe(gulp.dest(dest + '/css'))
        .pipe(browserSync.stream());
    done();
}


// HTML Partials
function html(done) {
    return gulp.src(paths.html)
        .pipe(partials({
            start: '<% {{path}} ',
              end: '%>',
           removeTags: true
           }))
        .pipe(htmlmin({
           collapseWhitespace: true, 
           removeComments: true
        }))
        .pipe(gulp.dest(dest))
        .pipe(browserSync.stream());

    done();
}


// Copy Fonts
function fonts(done) {
    return gulp.src(paths.fonts)
    .pipe(gulp.dest(dest + '/fonts'));
}


// Do stuff with Images
function img(done) {
    return gulp.src(paths.img)
    .pipe(webp())
    .pipe(gulp.dest(dest + '/img'));
}


// Do Javascript Stuff 
function javascript(done) {
    return gulp.src(paths.js)
    .pipe(gulp.dest(dest + '/js'));
}


// Watch for changes & do stuff
function watchFiles() {
    gulp.series(html,css,fonts,img);
    gulp.watch(src + '/sass/**', gulp.series(css, reload));
    gulp.watch(src + '/html/**', gulp.series(html, reload));
}


// Run a server 
function server() {
    browserSync.init({
        server: {
             baseDir: "./dist"
        }
    });
}


// Reload my Browser
function reload(done) {
    browserSync.reload();
    done();
}


// Confirm project ready to sync
function message(done) {
    return gulp.src(src)
    .pipe(prompt.confirm('Are you sure you are done with the project?'))
    done();
}


// Complex tasks
const dev = gulp.parallel(html,css,fonts,img,server,watchFiles);
const build = gulp.series(html,css,fonts,img);


// Export tasks
exports.default  = dev;
exports.dev      = dev;
exports.build    = build;

exports.img    = img;