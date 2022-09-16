const gulp = require('gulp');
const gulpif = require('gulp-if');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const cleanCss = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const gcmq = require('gulp-group-css-media-queries');
const gulpSass = require('gulp-sass');
const nodeSass = require('node-sass');
const sass = gulpSass(nodeSass);

import settings from '../config';

const { paths } = settings;

const styles = done => {
  for (let i = 0; i < paths.styles.length; i++) {
    const appoint = paths.styles[i].appoint;
    const files = paths.styles[i].files;
    const dest = paths.styles[i].dest;

    gulp
      .src(files, { sourcemaps: settings.mode === 'development' })
      .pipe(plumber())
      .pipe(sass())
      .pipe(gcmq())
      .pipe(autoprefixer(settings.autoprefixer))
      .pipe(
        cleanCss({
          // format: 'keep-breaks',
          level: {
            2: {
              removeDuplicateRules: true,
            },
          },
        })
      )
      .pipe(
        gulpif(
          appoint === 'pages',
          rename(function (path) {
            if (path.basename !== 'index') {
              path.dirname += '/' + path.basename;
            }
            path.basename = 'style';
          })
        )
      )
      .pipe(gulp.dest(dest, { sourcemaps: '.' }));
  }
  done();
};

export default styles;
