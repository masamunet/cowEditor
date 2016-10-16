var gulp = require('gulp'),
browserify = require('browserify'),
babelify = require('babelify'),
webserver = require('gulp-webserver'),
source = require('vinyl-source-stream'),
watchify = require('watchify');

const config = {
  src: 'src',
  dist: 'public',
  assets: 'assets',
};

//Webサーバー
gulp.task('webserver', () => {
  return gulp.src(config.dist)
  .pipe(webserver({
    livereload: true, //ライブリロード
  }))
});

gulp.task('browserify', ()=>{
  var b = browserify(`${config.src}/app.jsx`, {debug:true, cache: {}, packageCache: {}})
  var w = watchify(b)
  .transform(babelify, {presets: ["es2015", "react"]});
  var bundle = ()=>{
    return w.bundle()
    .on('error', (err)=>{ console.log(`Error : ${err.message}`)})
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(`./${config.dist}/`));
  };
  w.on('update', bundle);
  return bundle();
});


gulp.task('default', ['webserver', 'browserify']);
