const gulp = require('gulp');

import clean from './gulp/tasks/clean';
import icons from './gulp/tasks/icons';
import images from './gulp/tasks/images';
import styles from './gulp/tasks/styles';
import scripts from './gulp/tasks/scripts';
import templates from './gulp/tasks/templates';
import staticFiles from './gulp/tasks/static';
import server from './gulp/tasks/server';
import settings from './gulp/config';

const { paths } = settings;

const watch = () => {
  gulp.watch(paths.icons.src, icons);
  gulp.watch(paths.images.src, images);
  gulp.watch(paths.watch.styles + '/**/*.*', styles);
  gulp.watch(paths.watch.scripts + '/**/*.*', scripts);
  gulp.watch(paths.watch.templates + '/**/*.*', templates);
  gulp.watch(paths.static.map(item => item[0]), staticFiles);
};

const setDev = done => {
  settings.mode = 'development';
  done();
};

// const setProd = done => {
//   settings.mode = 'production';
//   done();
// };

gulp.task('build', gulp.series(clean, gulp.parallel(templates, scripts, styles, images, icons, staticFiles)));
gulp.task('dev', gulp.series(setDev, 'build'));

gulp.task('build:watch', gulp.series('build', gulp.parallel(watch, server)));
gulp.task('dev:watch', gulp.series('dev', gulp.parallel(watch, server)));

