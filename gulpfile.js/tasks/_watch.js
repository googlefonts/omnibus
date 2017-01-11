
/* Notes:
   - gulp/tasks/browserify.js handles js recompiling with watchify
   - gulp/tasks/browserSync.js watches and reloads compiled files
   - watchers are made using `gulp-watch` so new files are automatically watched
*/

const gulp = require('gulp');
const config = require('../config');
const browserSync = require('browser-sync');
const runSequence = require('run-sequence');
const watch = require('gulp-watch');


gulp.task('watch', ['clean'], function() {
  runSequence('default', ['watchify', 'browserSync']);

  watch(config.svgSprite.src + '/' + config.svgSprite.glob, function() {
    runSequence('sprite', browserSync.reload);
  });

  watch(config.eslint.src, function() {
    runSequence('eslint');
  });

  watch(config.sass.src, function() {
    runSequence('sasslint', 'sass');
  });

  watch(config.images.src, function() {
    runSequence('images', browserSync.reload);
  });

  watch(config.html.src + '/' + config.html.glob, function() {
    runSequence('html', browserSync.reload);
  });
});
