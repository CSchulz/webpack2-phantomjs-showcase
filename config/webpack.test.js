var helpers = require('./helpers');

module.exports = function(options) {
    var config = {
        devtool: 'inline-source-map',

        resolve: {
            extensions: ['.ts', '.js']
        },

        watchOptions: {
            poll: 1000
        },

        module: {
            rules: [
                {
                    enforce: 'pre',
                    test: /\.js$/,
                    loader: 'source-map-loader'
                },
                {
                    test: /\.ts$/,
                    loader: 'awesome-typescript-loader',
                    query: {
                        // use inline sourcemaps for "karma-remap-coverage" reporter
                        sourceMap: options.autowatch,
                        inlineSourceMap: !options.autowatch
                    }
                },
                {
                    test: /\.ts$/,
                    loader: 'angular2-template-loader'
                },
                {
                    test: /\.html$/,
                    loader: 'html-loader'
                },
                {
                    test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                    loader: 'null'
                },
                {
                    test: /\.css$/,
                    exclude: helpers.root('src', 'app'),
                    loader: 'null'
                },
                {
                    test: /\.css$/,
                    include: helpers.root('src', 'app'),
                    loader: 'raw-loader'
                }
            ]
        }
    };

    // skip coverage in watch mode
    if (!options.autowatch) {
        config.module.rules.push(/**
             * Instruments JS files with Istanbul for subsequent code coverage reporting.
             * Instrument only testing sources.
             *
             * See: https://github.com/deepsweet/istanbul-instrumenter-loader
             */
            {
                enforce: 'post',
                test: /\.(js|ts)$/,
                include: helpers.root('src'),
                loader: 'istanbul-instrumenter-loader'
            });
    }

    return config;
};