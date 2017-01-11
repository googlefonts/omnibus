

const gulp = require('gulp');
const browserSync = require('browser-sync');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const handleErrors = require('../util/handleErrors');
const config = require('../config').sass;
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const importUrls = require('postcss-import');
const removeClasses = require('../util/removeCssClasses')(config.remove);

const procesors = [
  importUrls(),
  removeClasses,
  autoprefixer({ browsers: config.prefix }),
];

gulp.task('sass', function() {
  return gulp.src(config.src)
    .pipe(sourcemaps.init())
    .pipe(sass(config.settings))
    .on('error', handleErrors)
    .pipe(postcss(procesors))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.reload({ stream: true }));
});
