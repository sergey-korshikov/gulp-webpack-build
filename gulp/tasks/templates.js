const gulp = require('gulp');
const gulpif = require('gulp-if');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const prettify = require('gulp-html-prettify');
const pug = require('gulp-pug');

import settings from '../config';

const { paths } = settings;

const templates = done => {
  for (let i = 0; i < paths.templates.length; i++) {
    const files = paths.templates[i].files;
    const appoint = paths.templates[i].appoint;

    gulp
      .src(files)
      .pipe(plumber())
      .pipe(
        pug({
          pretty: true,
        })
      )
      .pipe(
        prettify({
          indent_char: '',
          indent_size: 2,
        })
      )
      .pipe(
        gulpif(
          appoint === 'pages',
          rename(function (path) {
            path.dirname += '/' + path.basename;
            path.basename = 'index';
          })
        )
      )
      .pipe(
        gulpif(
          appoint === 'ajax',
          rename(function (path) {
            path.dirname += '/ajax';
          })
        )
      )
      .pipe(plumber.stop())
      .pipe(gulp.dest(paths.build));
  }
  done();
};

export default templates;
