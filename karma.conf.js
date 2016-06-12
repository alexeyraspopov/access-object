module.exports = config => {
  const TEST_FILES = 'test/*-test.js';

  config.set({
    files: [
      'node_modules/whatwg-fetch/fetch.js',
      TEST_FILES
    ],

    preprocessors: {
      [TEST_FILES]: ['webpack']
    },

    frameworks: ['mocha'],
    browsers: ['Chrome'],
    reporters: ['mocha', 'coverage'],

    singleRun: true,

    webpack: {
      module: {
        loaders: [{ exclude: [/node_modules/], test: /\.js$/,
                    loader: 'isparta' }]
      }
    },

    webpackMiddleware: {
      noInfo: true
    },

    coverageReporter: { type: 'html', dir: 'coverage' }
  });
};
