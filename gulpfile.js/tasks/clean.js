

const gulp = require('gulp');
const del = require('del');
const config = require('../config');

gulp.task('clean', function(cb) {
  del(config.destFolder, { dot: true, force: true }).then(paths => {
    cb();
  });
});
