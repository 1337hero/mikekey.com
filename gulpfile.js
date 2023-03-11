// Mike's Landing Page Gulp Workflow
'use strict';

// Plugins
const   gulp = require('gulp'),
        browserSync = require('browser-sync').create(),
           partials = require('gulp-inject-partials'),
            htmlmin = require('gulp-htmlmin'),
             concat = require('gulp-concat'),
             rename = require('gulp-rename'),
             webpcss = require("gulp-webpcss"),
              clean = require('gulp-clean-css'),
               maps = require('gulp-sourcemaps'),
               sass = require('gulp-sass')(require('sass'));

// File Paths
const base = './',
       src = base + 'dev',
      dest = base + 'dist',
     paths = {
          js: src + '/js/app.js' ,
         img: src + '/img/*',
        html: src + '/html/*.html',
        scss: src + '/sass/app.scss'
     };


// SASS => CSS
function css(done) {
    return gulp.src(paths.scss)
        .pipe(maps.init())
        .pipe(sass().on('error', sass.logError))
        //.pipe(webpcss({}))
        .pipe(clean()) // for minifying the file
        .pipe(rename('style.css'))
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

// Watch for changes & do stuff
function watchFiles() {
    gulp.watch(paths.scss + '**', gulp.series(css, reload));
    gulp.watch(paths.html + '**', gulp.series(html, reload));
}

// Run a server 
function server() {
    browserSync.init({
        server: {
             baseDir: "./public"
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
const dev = gulp.parallel(server, watchFiles);
const build = gulp.series(html,css);

// Export tasks
exports.default = dev;
exports.build = build;
