const autowatch = process.env.npm_lifecycle_script.indexOf('--no-auto-watch') === -1;

var webpackConfig = require('./webpack.test')({autowatch: autowatch});

module.exports = function (config) {
    var _config = {
        basePath: '',

        frameworks: ['jasmine', 'intl-shim'],

        files: [
            {pattern: './config/karma-test-shim.js', watched: false},
            './node_modules/intl/locale-data/jsonp/de-DE.js'
        ],

        preprocessors: {
            './config/karma-test-shim.js': autowatch ? ['webpack', 'sourcemap'] : ['coverage', 'webpack', 'sourcemap']
        },

        webpack: webpackConfig,

        webpackMiddleware: {
            stats: 'errors-only'
        },

        webpackServer: {
            noInfo: true
        },

        reporters: ['mocha'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['PhantomJS'],
        browserDisconnectTimeout : 10000, // default 2000
        browserDisconnectTolerance : 1, // default 0
        browserNoActivityTimeout : 60000, //default 10000
        singleRun: false
    };

    // skip coverage in watch mode
    // enable karma jasmine html reporter in non watch mode
    if (autowatch) {
        _config.reporters.push('kjhtml');
    } else {
        _config.coverageReporter = {
            type: 'in-memory'
        };
        _config.reporters.push('coverage', 'remap-coverage');
        _config.remapCoverageReporter = {
            'text-summary': null,
            html: './coverage/html',
            lcovonly: './coverage/lcov.info',
            cobertura: './coverage/cobertura.xml'
        };

    }

    config.set(_config);
};