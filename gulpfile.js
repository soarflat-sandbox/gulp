const { src, dest, lastRun, parallel, watch } = require('gulp');
const beautify = require('gulp-beautify');
const browserSync = require('browser-sync').create();
const imagemin = require('gulp-imagemin');
const gulpTap = require('gulp-tap');
const gulpPug = require('gulp-pug');
const gulpSass = require('gulp-sass');
const mozjpeg = require('imagemin-mozjpeg');
const pngquant = require('imagemin-pngquant');
const sassGraph = require('sass-graph');

gulpSass.compiler = require('node-sass');

const paths = {
  pug: {
    src: './src/pug/**/*.pug',
    dest: './dist/'
  },
  scss: {
    src: './src/scss/**/*.scss',
    dest: './dist/css'
  },
  images: {
    src: './src/images/**/*.{jpg,jpeg,png,svg,gif}',
    dest: './dist/images/'
  }
};

// Pugをコンパイルするタスク
const pug = () =>
  src([paths.pug.src, '!src/pug/**/_*.pug'])
    .pipe(gulpPug({ pretty: true, basedir: './src/pug' }))
    .pipe(beautify.html({ indent_size: 2 }))
    .pipe(dest(paths.pug.dest))
    .pipe(browserSync.stream());

// Scssをコンパイルするタスク
const scss = () =>
  src(paths.scss.src)
    .pipe(
      gulpSass({
        outputStyle: 'compressed'
      }).on('error', gulpSass.logError)
    )
    .pipe(dest(paths.scss.dest))
    .pipe(browserSync.stream());

const graph = sassGraph.parseDir('./src/scss/');
// watch時にScssをコンパイルするタスク
// 最後変更したScssファイルのみをコンパイルする
// _base.scssのような複数ファイルでimportされているファイルを更新した場合
// インポートしているファイルもコンパイルする
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

// imageminのオプション
const imageminOption = [
  pngquant({
    quality: [0.7, 0.85]
  }),
  mozjpeg({
    quality: 85
  }),
  imagemin.gifsicle(),
  imagemin.jpegtran(),
  imagemin.optipng(),
  imagemin.svgo({
    removeViewBox: false
  })
];
// 画像を圧縮するタスク
const images = () =>
  src(paths.images.src, {
    since: lastRun(images)
  })
    .pipe(imagemin(imageminOption))
    .pipe(dest(paths.images.dest));

const pugWatcher = () => watch([paths.pug.src], pug);
const scssWatcher = () => watch([paths.scss.src], scssWhenWatching);
const imagesWatcher = () => watch([paths.scss.src], images);
const watcher = parallel(pugWatcher, scssWatcher, imagesWatcher);

const server = () => {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  });
};

exports.pug = pug;
exports.scss = scss;
exports.images = images;
exports.watcher = watcher;
exports.server = server;
exports.dev = parallel(server, watcher);
exports.default = parallel(pug, scss, images);
