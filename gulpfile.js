var gulp = require('gulp'),
os = require('os'),
del = require('del'),
runSequence = require('run-sequence'),
pug = require('gulp-pug'),
sass = require('gulp-sass'),
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


//browserify watchify babelify
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


//コピー
gulp.task('copy', ()=>{
  return gulp.src(`./${config.assets}/**`)
  .pipe(gulp.dest(`./${config.dist}`))
});

gulp.task('copy:watch', ()=>{
  gulp.watch(`./${config.assets}/**`, ['copy']);
});

//pug
// _ アンダーバーから始まる、インクルードファイルをコンパイルしない
const watchPugFile = `./${config.src}/**/*.pug`;
const pugFiles = [watchPugFile, `!./${config.src}/**/_*.pug`];
gulp.task('pug:dev', () => {
  return gulp.src(pugFiles)
  .pipe(pug({
    pretty: true
  }))
  .pipe(gulp.dest(config.dist))
});

gulp.task('pug', () => {
  return gulp.src(pugFiles)
  .pipe(pug({
    pretty: false
  }))
  .pipe(gulp.dest(`./${config.dist}/`))
});

gulp.task('pug:watch', () =>{
  return gulp.watch(watchPugFile, ['pug:dev']);
});

//sass
const watchSassFile = `./${config.src}/**/*.scss`;
const sassFiles = [watchSassFile, `!./${config.src}/**/_*.scss`];
gulp.task('sass', () => {
  return gulp.src(sassFiles)
  .pipe(sass.sync().on('errer', sass.logError))
  .pipe(gulp.dest(config.dist))
});

gulp.task('sass:watch', () =>{
  return gulp.watch(watchSassFile, ['sass']);
});


//clean
gulp.task('clean', ()=>{
  return del(config.dist);
});

//watch
gulp.task('watch', ['pug:watch', 'sass:watch', 'browserify', 'copy:watch']);

//task
gulp.task('develop', ['webserver', 'watch']);
gulp.task('default', ['develop']);
gulp.task('build', ()=>{
  return runSequence(
    'clean',
    ['pug', 'sass', 'browserify', 'copy']
  );
});
