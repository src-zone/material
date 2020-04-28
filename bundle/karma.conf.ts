const path = require('path');

module.exports = (config) => {
    const isWatch = process.env.npm_lifecycle_script && process.env.npm_lifecycle_script.indexOf('--single-run false') !== -1;
    // Istanbul screws up typescript sourcemaps, so we have either sourcemaps to the typescript without coverage,
    //  or coverage but sourcemaps go to transpiled typescript:
    console.log(
        'Running tests in ' + (
            isWatch ? 'DEBUG' : 'TEST' 
        ) + ' mode, meaning: ' + (isWatch ?
            'typescript sourcemaps ARE available, but coverage IS NOT recorded' :
            'typescript sourcemaps ARE NOT available, but coverage IS recorded'
        ));

    config.set({
        basePath: '',
        
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],

        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-webpack'),
            require('karma-sourcemap-loader'),
            require('karma-spec-reporter'),
            require('karma-coverage-istanbul-reporter'),
            require('istanbul-instrumenter-loader'),
            require('karma-junit-reporter')
        ],

        // otherwise the test/test.ts file is served as video/mp2t
        // and none of the tests will execute:
        mime: { 'text/x-typescript': ['ts','tsx'] },

        files: [
            { pattern: 'src/test.ts', watched: false },
            'node_modules/material-components-web/dist/material-components-web.css'
        ],

        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            // Note: karma 'sourcemap' preprocessors doesn't seem to have any effect after 'webpack', removed
            'src/test.ts': ['webpack'],
        },

        // webpack
        webpack: {
            mode: 'development',
            resolve: {
                extensions: ['.ts', '.js']
            },
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        use: [
                            { loader: 'source-map-loader' }
                        ],
                        enforce: "pre"
                    },
                    {
                        test: /\.ts$/,
                        use: [
                            { loader: 'ts-loader' },
                            { loader: 'angular2-template-loader' }
                        ],
                        exclude: /node_modules/
                    },
                    {
                        test: /\.html$/,
                        use: 'raw-loader'
                    },
                    {
                        test: /\.css$/,
                        use: [
                            { loader: 'to-string-loader' },
                            { loader: 'css-loader' }]
                    },
                    {
                        enforce: 'post',
                        test: isWatch ? /\.nomatch$/ : /\.ts$/,
                        use: [
                            {
                                loader: 'istanbul-instrumenter-loader',
                                options: { esModules: true }
                            }
                        ],
                        exclude: [
                            /\.spec\.ts$/,
                            /test\.ts$/,
                            /node_modules/
                        ]
                    }
                ]
            },

            devtool: 'eval-source-map',

            performance: { hints: false }
        },

        webpackServer: {
            noInfo: true
        },

        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['spec', 'coverage-istanbul', 'junit'],

        coverageIstanbulReporter: {
            reports: ['html', 'lcovonly'],
            dir: path.join(__dirname, 'coverage'),
            combineBrowserReports: true,
            fixWebpackSourcePaths: true
        },

        junitReporter: {
            outputDir: path.join(__dirname, 'coverage', 'junit'),
            outputFile: 'all/junit.xml',
            useBrowserName: false
        },

        port: 9876,
        colors: true,
        // possible values: LOG_DISABLE, LOG_ERROR, LOG_WARN, LOG_INFO, LOG_DEBUG
        logLevel: config.LOG_INFO,
        autoWatch: true,
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: [isWatch ? 'ChromeDebugging' : 'Chrome'],
        customLaunchers: isWatch ? {
            ChromeDebugging: {
                base: 'Chrome',
                flags: ['--remote-debugging-port=9333']
            }
        } : undefined,
        singleRun: true
    });
}
