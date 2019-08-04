const { src, dest, lastRun, parallel, watch } = require('gulp');
const browserSync = require('browser-sync').create();
const gulpTap = require('gulp-tap');
const gulpPug = require('gulp-pug');
const gulpSass = require('gulp-sass');
gulpSass.compiler = require('node-sass');
const sassGraph = require('sass-graph');
const graph = sassGraph.parseDir('src/scss/');

const paths = {
  pug: {
    src: './src/pug/**/*.pug',
    dest: './dist/'
  },
  scss: {
    src: './src/scss/**/*.scss',
    dest: './dist/css'
  }
};

const pug = () =>
  src([paths.pug.src, '!src/pug/**/_*.pug'])
    .pipe(gulpPug({ pretty: true, basedir: baseDir.pug }))
    .pipe(dest(paths.pug.dest))
    .pipe(browserSync.stream());

const scss = () =>
  src(paths.scss.src)
    .pipe(
      gulpSass({
        outputStyle: 'compressed'
      }).on('error', gulpSass.logError)
    )
    .pipe(dest(paths.scss.dest))
    .pipe(browserSync.stream());

const scssWhenWatching = () =>
  src(paths.scss.src, { since: lastRun(scssWhenWatching) }).pipe(
    gulpTap(file => {
      const files = [file.path];
      const addParent = childPath =>
        graph.visitAncestors(childPath, parent => {
          if (!files.includes(parent)) files.push(parent);
          return addParent(parent);
        });
      addParent(file.path);
      src(files)
        .pipe(
          gulpSass({
            outputStyle: 'compressed'
          }).on('error', gulpSass.logError)
        )
        .pipe(dest(paths.scss.dest))
        .pipe(browserSync.stream());
    })
  );

const pugWatcher = () => watch([paths.pug.src], pug);
const scssWatcher = () => watch([paths.scss.src], scssWhenWatching);
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
