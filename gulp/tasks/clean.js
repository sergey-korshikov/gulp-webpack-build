const del = require('del');

import settings from '../config';

const { paths } = settings;

const clean = () => {
  // return del([paths.build + '*', '!' + paths.build + 'static']);
  return del([paths.build + '*']);
};

export default clean;
