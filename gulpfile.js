var gulp = require('gulp');
var mocha = require('gulp-mocha');

//gulp.task('bost suitcase', function() {
//  var error = false;
//  gulp.
//    src('./scripts/web-server.js').
//    on('error', function(err) {
//      console.log(err);
//      console.log('Tests failed!');
//      error = true;
//    })
//});

gulp.task('default', function() {
  var error = false;
  gulp.
    src('./test/connectionModuleTest.js').
    pipe(mocha()).
    on('error', function(err) {
      console.log(err);
      console.log('Tests failed!');
      error = true;
    })
});

gulp.task('test', function() {
  var error = false;
  gulp.
    src('./test/*.js').
    pipe(mocha()).
    on('error', function(err) {
      console.log(err);
      console.log('Tests failed!');
      error = true;
    })
});

gulp.task('watch', function() {
  gulp.watch(['./test/*.js'], ['test']);
});
