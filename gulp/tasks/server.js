const browserSync = require('browser-sync').create();

import settings from '../config';

const { paths } = settings;

const server = () =>
  browserSync.init({
    open: true,
    server: {
      baseDir: paths.build,
      directory: false,
    },
    middleware: [
      {
        route: '/test',
        handle: function (req, res, next) {
          let resData = true;
          console.log(req.url);

          req.setEncoding('utf8');

          req.on('data', chunk => {
            // resData = JSON.parse(chunk);
            resData = chunk;
            console.log(chunk);
          });

          req.on('end', () => {
            try {
              // const data = JSON.stringify(resData);
              // res.write(data);
              res.write(resData);
              res.end();
            } catch (error) {
              res.statusCode = 400;
              return res.end(`error: ${error.message}`);
            }
          });
        },
      },
    ],
    ghostMode: {
      clicks: false,
      forms: false,
      scroll: false,
    }, // синхронизация между браузерами
    // tunnel: true,
    notify: true,
    files: paths.build + '**/*.*',
  });

export default server;
