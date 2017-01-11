

const gulp = require('gulp');
const config = require('../config').production;
const postcss = require('gulp-postcss');
const nano = require('cssnano');

const procesors = [
  nano(config.cssCompressionOpts),
];

gulp.task('minifyCss', function() {
  return gulp.src(config.cssSrc)
    .pipe(postcss(procesors))
    .pipe(gulp.dest(config.cssDest));
});
