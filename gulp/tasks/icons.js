const gulp = require('gulp');
const svgmin = require('gulp-svgmin');
const cheerio = require('gulp-cheerio');
const sprite = require('gulp-svg-sprite');
const plumber = require('gulp-plumber');

import settings from '../config';

const { paths } = settings;

const configSprite = {
  mode: {
    symbol: {
      sprite: '../sprite.svg',
    },
  },
};

const icons = done => {
  gulp
    .src(paths.icons.src)
    .pipe(plumber())
    .pipe(
      svgmin({
        js2svg: {
          pretty: true,
        },
      })
    )
    .pipe(
      cheerio({
        run: function ($) {
          $('[xmlns]').removeAttr('xmlns');
          // $('[fill]').removeAttr('fill');
          // $('[stroke]').removeAttr('stroke');
          // $('[style]').removeAttr('style');
        },
        parserOptions: { xmlMode: true },
      })
    )
    .pipe(sprite(configSprite))
    .pipe(plumber.stop())
    .pipe(gulp.dest(paths.icons.dist));

  done();
};

export default icons;
