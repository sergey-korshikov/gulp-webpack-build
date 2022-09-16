const gulp = require('gulp');
const gulpif = require('gulp-if');
const plumber = require('gulp-plumber');
const image = require('gulp-image');
// const imagemin = require('gulp-imagemin');

const imageOptions = {
  concurrent: 5,
  optimizationLevel: 5,
  jpegRecompress: true,
  zopflipng: false,
  jpegoptim: true,
  pngquant: true,
  gifsicle: true,
  optipng: true,
  mozjpeg: true,
  svgo: true,
};

// const imageminOptions = [
//   imagemin.gifsicle({ interlaced: true }),
//   imagemin.mozjpeg({ quality: 80, progressive: true }),
//   imagemin.optipng({ optimizationLevel: 2 }),
//   imagemin.svgo({
//     plugins: [{ removeViewBox: true }, { cleanupIDs: true }],
//   }),
// ];

import settings from '../config';

const { paths } = settings;

const images = done => {
  gulp
    .src(paths.images.src)
    .pipe(plumber())
    .pipe(
      gulpif(
        settings.mode !== 'development',
        image(imageOptions)
        // imagemin(imageminOptions)
      )
    )
    .pipe(plumber.stop())
    .pipe(gulp.dest(paths.images.dist));

  done();
};

export default images;
