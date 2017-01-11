

const config = require('../config').production;
const gulp = require('gulp');
const sizereport = require('gulp-sizereport');

gulp.task('size-report', function() {
  return gulp.src(config.reportSrc)
    .pipe(sizereport({
      gzip: true,
    }));
});
