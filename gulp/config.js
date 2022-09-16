const PATHS = {
  src: './src/',
  build: './build/',
};

const sources = {
  templates: PATHS.src + 'templates',
  scripts: PATHS.src + 'scripts',
  styles: PATHS.src + 'styles',
  static: PATHS.src + 'static',
};

export default {
  mode: 'production',

  paths: {
    src: PATHS.src,
    build: PATHS.build,

    watch: sources,

    icons: {
      src: [sources.static + '/svg/*.svg'],
      dist: [PATHS.build + 'icons/'],
    },

    images: {
      src: [sources.static + '/images/**/*.*'],
      dist: [PATHS.build + 'images/'],
    },

    static: [
      [sources.static + '/fonts/**/*.*', PATHS.build + 'fonts/'],
      [sources.static + '/icons/**/*.*', PATHS.build + 'icons/'],
      [sources.static + '/data/**/*.*', PATHS.build + 'data/'],
    ],

    templates: [
      {
        files: sources.templates + '/*.pug',
      },
      {
        files: sources.templates + '/pages/*.pug',
        appoint: 'pages',
      },
      {
        files: sources.templates + '/ajax/*.pug',
        appoint: 'ajax',
      },
    ],

    styles: [
      {
        files: sources.styles + '/*.*',
        appoint: 'general',
        dest: PATHS.build + 'styles',
      },
      // {
      //   files: sources.styles + '/pages/*.*',
      //   appoint: 'pages',
      //   dest: PATHS.build,
      // },
      // {
      //   files: sources.styles + '/vendors/*.*',
      //   appoint: 'vendors',
      //   dest: PATHS.build + 'styles/vendors',
      // },
    ],

    scripts: {
      entry: {
        'main-page': [sources.scripts + '/main-page.js'],
        'catalog-page': [sources.scripts + '/catalog-page.js'],
        'product-page': [sources.scripts + '/product-page.js'],
        'other-page': [sources.scripts + '/other-page.js'],
      },
      files: sources.scripts + '/*.*',
      dest: PATHS.build + 'scripts',
    },
  },

  autoprefixer: {
    cascade: false,
    grid: true,
    overrideBrowserslist: ['last 5 versions'],
  },
  // autoprefixer: {
  //   cascade: false,
  //   overrideBrowserslist: ['> 0.1%'],
  // },
  // autoprefixer: {
  //   cascade: false,
  //   overrideBrowserslist: ['ie >= 10', 'ff >= 29', 'Opera >= 12', 'iOS >= 6', 'Chrome >= 28', 'Android >= 2']
  // },
};
