const { src, dest, lastRun, parallel, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const gulpPug = require('gulp-pug');
const gulpSass = require('gulp-sass');
const plumber = require('gulp-plumber');

gulpSass.compiler = require('node-sass');

// TODO
// lastRunを利用して差分だけビルドするようにする？

const pug = () =>
  src(['src/pug/**/*.pug', '!src/pug/**/_*.pug'])
    .pipe(plumber())
    .pipe(gulpPug({ pretty: true, basedir: 'src/pug' }))
    .pipe(dest('dist'))
    .pipe(browserSync.stream());

const scss = () =>
  src('src/scss/**/*.scss')
    .pipe(plumber())
    .pipe(
      gulpSass({
        // outputStyle: 'compressed'
        outputStyle: 'expanded'
      }).on('error', gulpSass.logError)
    )
    .pipe(dest('dist/css'))
    .pipe(browserSync.stream());

const pugWatcher = () => watch(['src/pug/**/*.pug'], pug);
const scssWatcher = () => watch(['src/scss/**/*.scss'], scss);
const watcher = parallel(pugWatcher, scssWatcher);

const server = () => {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
};

exports.pug = pug;
exports.scss = scss;
exports.watcher = watcher;
exports.server = server;
exports.dev = parallel(server, watcher);
exports.default = parallel(pug, scss);
