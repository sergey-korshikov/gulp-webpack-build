const gulp = require('gulp');
const plumber = require('gulp-plumber');
const webpackStream = require('webpack-stream');

import settings from '../config';

const { paths } = settings;

const scripts = done => {
  gulp
    .src(paths.scripts.files)
    .pipe(plumber())
    .pipe(
      webpackStream({
        mode: settings.mode,
        entry: paths.scripts.entry,
        output: {
          filename: '[name].js',
        },
        module: {
          rules: [
            {
              test: /\.m?js$/,
              exclude: /node_modules/,
              use: {
                loader: 'babel-loader',
                options: {
                  presets: [
                    [
                      '@babel/preset-env',
                      {
                        targets: 'defaults',
                      },
                    ],
                  ],
                },
              },
            },
          ],
        },
        devtool: settings.mode === 'development' ? 'source-map' : false,
        optimization: {
          emitOnErrors: true,
          //   splitChunks: {
          //     cacheGroups: {
          //       vendor: {
          //         name: 'vendors',
          //         // test: /node_modules/,
          //         chunks: 'all',
          //         enforce: true,
          //       },
          //     },
          //   },
        },
      })
    )
    .on('error', function (err) {
      console.error('WEBPACK ERROR', err);
      this.emit('end');
    })
    .pipe(plumber.stop())
    .pipe(gulp.dest(paths.scripts.dest));

  done();
};

export default scripts;
