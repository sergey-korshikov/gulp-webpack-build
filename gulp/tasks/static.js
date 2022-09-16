const gulp = require('gulp');
const rename = require('gulp-rename');
const gulpif = require('gulp-if');
const plumber = require('gulp-plumber');
const cleanCss = require('gulp-clean-css');
const uglify = require('gulp-uglify-es').default;

import settings from '../config';

const { paths } = settings;

const staticFiles = done => {
  for (let i = 0; i < paths.static.length; i++) {
    const src = paths.static[i][0];
    const dist = paths.static[i][1];
    const conditionMIN = () => src.indexOf('.min.') === -1;
    const conditionCSS = () => src.indexOf('.css') !== -1;
    const conditionJS = () => src.indexOf('.js') !== -1;

    gulp
      .src(src)
      .pipe(plumber())
      .pipe(gulpif(conditionCSS() && conditionMIN(), cleanCss()))
      .pipe(
        gulpif(
          conditionJS,
          uglify({
            // compress: {
            // 	unused: false
            // },
            // toplevel: true,
            output: {
              comments: `/^!/`,
            },
          })
        )
      )
      .pipe(gulpif(conditionJS() && conditionMIN(), rename({ suffix: '.min' })))
      .pipe(plumber.stop())
      .pipe(gulp.dest(dist));
  }
  done();
};

export default staticFiles;
