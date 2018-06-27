import 'babel-polyfill';
import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackHotServerMiddleware from 'webpack-hot-server-middleware';
import clientConfig from '../webpack/client.dev';
import serverConfig from '../webpack/server.dev';

const DEV = process.env.NODE_ENV === 'development';
const { publicPath, outputPath } = clientConfig.output;
const app = express();

// UNIVERSAL HMR + STATS HANDLING GOODNESS:

if (DEV) {
  const multiCompiler = webpack([clientConfig, serverConfig]);
  const clientCompiler = multiCompiler.compilers[0];

  app.use(webpackDevMiddleware(multiCompiler, { publicPath }));
  app.use(webpackHotMiddleware(clientCompiler));
  app.use(
    webpackHotServerMiddleware(multiCompiler, {
      serverRendererOptions: { outputPath },
    }),
  );
} else {
  /* eslint-disable import/no-unresolved, global-require */
  const clientStats = require('../buildClient/stats.json');
  const serverRender = require('../buildServer/main.js').default;
  /* eslint-enable import/no-unresolved, global-require */

  app.use(publicPath, express.static(outputPath));
  app.use(serverRender({ clientStats, outputPath }));
}

app.listen(3000, () => {
  console.log('Listening @ http://localhost:3000/'); // eslint-disable-line no-console
});
