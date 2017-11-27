// Helper: root(), and rootDir() are defined at the bottom
const path = require('path');
const webpack = require('webpack');

// Webpack Plugins
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const PurifyPlugin = require('@angular-devkit/build-optimizer').PurifyPlugin;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const AngularCompilerPlugin = require('@ngtools/webpack').AngularCompilerPlugin;
const InlineChunkManifestHtmlWebpackPlugin = require('inline-chunk-manifest-html-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const rxPaths = require('rxjs/_esm5/path-mapping');

/**
 * Env
 * Get npm lifecycle event to identify the environment
 */
const ENV = process.env.npm_lifecycle_event;
const isTestWatch = ENV === 'test-watch';
const isTest = ENV === 'test' || isTestWatch;
const isProd = /^build.*$/.test(ENV);
const forceSourceMaps = true; // set to true for sourcemaps in production (e.g. to analyze bundle sizes) 

const sassLoader = {
  loader: 'sass-loader',
  options: {
    includePaths: [
      root('node_modules'),
      require("bourbon-neat").includePaths
    ]
  }
};
const cssLoaderForExtract = {
  loader: 'css-loader',
  options: {
    minimize: false // cause we use OptimizeCssAssetsPlugin after all css is bundled together
  }
}
const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    plugins: (loader) => [
      autoprefixer({
        browsers: ['last 2 version']
      })
    ]
  }
};
const babelLoader = {
  loader: 'babel-loader',
  options: {
    presets: [['env', {modules: false, targets: {browsers: ["last 2 versions", "ie >= 11"]}}]]
  }
};
const buildOptimizerLoader = {
  loader: '@angular-devkit/build-optimizer/webpack-loader',
  options: {sourceMap: !isProd || forceSourceMaps}
}

module.exports = function makeWebpackConfig(env) {
  const target = 'app';
  /**
   * allEntries: the definitions of roots & bundles
   */
  let entries = [
    {name: 'runtime', src: './src/runtime.ts'},
    {name: 'polyfills', src: './src/polyfills.ts', forRoot: ['app']},
    {name: 'vendor', src: './src/vendor.debug.ts', forRoot: ['app'], build: 'debug'},
    {name: 'mdc', filter: /.*\/node_modules\/(hammerjs|@material)\/.*\.(js|ts)$/, forRoot: ['app'], build: 'prod'},
    {name: 'rxjs', filter: /.*\/node_modules\/rxjs\/.*\.(js|ts)$/, forRoot: ['app'], build: 'prod'},
    {name: 'ngc', filter: /.\/node_modules\/@angular\/c.*\.(js|ts)$/, forRoot: ['app'], build: 'prod'},
    {name: 'ngx', filter: /.\/node_modules\/@angular\/.*\.(js|ts)$/, forRoot: ['app'], build: 'prod'},
    {name: 'blx', filter: /.*\/node_modules\/@blox\/.*\.(js|ts)$/, forRoot: ['app'], build: 'prod'},
    {name: 'app', src: './src/main.ts', template: './src/html/material.html', filename: 'material.html'}
  ];
  const allEntries = entries.filter(function(e) {
    return isProd ? (e.build == null || e.build === 'prod') : (e.build == null || e.build === 'debug');
  });
  const aotEntryModule = root('src/app/app.module') + '#AppModule';
  // name of the final css file for this target:
  const cssName = target + '.[contenthash].bundle.css';

  // the common chunks are the entries without 'filename' set, but having 'src' set:
  const commonChunks = allEntries.filter(function(e){return !e.filename && !!e.src; }).map(function(e){return e.name; });

  /**
   * Config
   * Reference: http://webpack.github.io/docs/configuration.html
   * This is the object where all configuration gets set
   */
  var config = {};

  /**
   * Devtool
   * Reference: http://webpack.github.io/docs/configuration.html#devtool
   * Type of sourcemap to use per build type
   */
  if (isProd) {
    config.devtool = forceSourceMaps ? 'source-map' : false; // don't generate sourcemaps for production
  } else if (isTest) {
    config.devtool = 'inline-source-map';
  } else {
    config.devtool = 'eval-source-map';
  }

  /**
   * Entry
   * Reference: http://webpack.github.io/docs/configuration.html#entry
   */
  config.entry =
    allEntries.filter(function(e){return !!e.src; }).reduce(function(m, o) {
      m[o.name] = o.src;
      return m;
    }, {});

  /**
   * Output
   * Reference: http://webpack.github.io/docs/configuration.html#output
   */
  config.output = isTest ? {} : {
    path: root('dist'),
    publicPath: isProd ? '/' : '/',
    filename: isProd ? 'js/[name].[chunkhash].js' : 'js/[name].js',
    chunkFilename: isProd ? 'js/[id].[chunkhash].chunk.js' : 'js/[id].chunk.js'
  };

  /**
   * Resolve
   * Reference: http://webpack.github.io/docs/configuration.html#resolve
   */
  config.resolve = {
    // only use one-level of node_modules (otherwise file/link to other modules in this repo will not
    //   work because they have their own nested node_modules):
    modules: [path.resolve(__dirname, 'node_modules')],
    // only discover files that have those extensions
    extensions: ['.ts', '.js', '.json', '.css', '.scss', '.html'],
    alias: Object.assign({'assets': path.resolve(__dirname, 'src/assets/')}, rxPaths),
    mainFields: [
      //'es2015', (we can use this once we target es2015)
      'browser',
      'module',
      'main'
    ]
  };

  config.performance = {
    hints: isProd ? "warning" : false
  };

  var atlOptions = '';
  if (isTest && !isTestWatch) {
    // awesome-typescript-loader needs to output inlineSourceMap for code coverage to work with source maps.
    atlOptions = 'inlineSourceMap=true&sourceMap=false';
  }

  /**
   * Loaders
   * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
   * List: http://webpack.github.io/docs/list-of-loaders.html
   * This handles most of the magic responsible for converting modules
   */
  config.module = {
    rules: [
      // Support for .ts files.
      {
        test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
        loaders: isProd ?
          [ buildOptimizerLoader, '@ngtools/webpack'] :
          ['awesome-typescript-loader?' + atlOptions, 'angular2-template-loader'],
        exclude: [isTest ? /\.(e2e)\.ts$/ : /\.(spec|e2e)\.ts$/, /node_modules\/(?!(ng2-.+))/]
      },

      {
        "test": isProd ? /\.js$/ : /\.doesnotmatchanything$/,
        loaders: [buildOptimizerLoader],
        exclude: /(?:node_modules[\\/]\@material[\\/].*\.js$)|(?:\.ngfactory\.js$)|(?:\.ngstyle\.js$)/
      },
      
      {
        test: /node_modules[\\/]\@material[\\/].*\.js$/,
        loaders: isProd ?
          [ babelLoader, buildOptimizerLoader ] :
          [ babelLoader ]
      },

      // copy those assets to output
      {
        test: /\.(png|jpe?g|gif|svg|woff2?|ttf|eot|ico)$/,
        loader: 'file-loader?name=assets/[name].[hash].[ext]'
      },

      // Support for CSS as raw text
      // use 'null' loader in test mode (https://github.com/webpack/null-loader)
      // all css in src/style will be bundled in an external css file
      {
        test: /\.css$/,
        exclude: root('src', 'app'),
        loader: isTest ? 'null-loader' : ExtractTextPlugin.extract({fallback: 'style-loader', use: [cssLoaderForExtract, postcssLoader]})
      },
      // all css required in src/app files will be merged in js files
      {test: /\.css$/, include: root('src', 'app'), loaders: ['raw-loader', postcssLoader]},

      // support for .scss files
      // use 'null' loader in test mode (https://github.com/webpack/null-loader)
      // all css in src/style will be bundled in an external css file
      {
        test: /\.(scss|sass)$/,
        exclude: root('src', 'app'),
        loader: isTest ? 'null-loader' : ExtractTextPlugin.extract({fallback: 'style-loader', use: [cssLoaderForExtract, postcssLoader, sassLoader]})
      },
      // all css required in src/app files will be merged in js files
      {test: /\.(scss|sass)$/, exclude: root('src', 'style'), loaders: ['to-string-loader', 'css-loader', postcssLoader, sassLoader]},

      // support for .html files:
      {
        test: /\.html$/,
        loader: 'html-loader',
        exclude: root('src', 'public'),
        options: {
          minimize: false,        // minimize doesn't play nice with angular templates
          interpolate: 'require'  // allow embedding the apidocs inside the component templates
        }
      }
    ]
  };

  if (isTest) {
    // instrument only testing sources with Istanbul, covers ts files
    config.module.rules.push({
      test: /\.ts$/,
      enforce: 'post',
      include: path.resolve('src'),
      loader: 'istanbul-instrumenter-loader',
      exclude: [/\.spec\.ts$/, /\.e2e\.ts$/, /node_modules/]
    });
  }

  // exclude prod builds, because tslint fails in combination with aot
  if (!isTest && !isTestWatch && !isProd) {
    // tslint support
    config.module.rules.push({
      test: /\.ts$/,
      enforce: 'pre',
      loader: 'tslint-loader'//,
      //options: {
      //  typeCheck: true,
      //  tsConfigFile: 'tsconfig.json'
      //}
    });
  }

  /**
   * Plugins
   * Reference: http://webpack.github.io/docs/configuration.html#plugins
   * List: http://webpack.github.io/docs/list-of-plugins.html
   */
  config.plugins = [
    // Define env variables to help with builds
    // Reference: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
    new webpack.DefinePlugin({
      // Environment helpers
      'process.env': {
        ENV: JSON.stringify(ENV),
        target: JSON.stringify(target)
      }
    }),

    // Workaround needed for angular 2 angular/angular#11580
    new webpack.ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /angular(\\|\/)core(\\|\/)@angular/,
      root('./src') // location of your src
    ),

    new webpack.optimize.ModuleConcatenationPlugin(),

    new webpack.LoaderOptionsPlugin({
      minimize: isProd,
      debug: false,
      options: {
        /**
         * Apply the tslint loader as pre/postLoader
         * Reference: https://github.com/wbuchwalter/tslint-loader
         */
        tslint: {
          emitErrors: false,
          failOnHint: false
        },
      }
    })
  ];

  if (isProd)
    config.plugins.push(new AngularCompilerPlugin({
      tsConfigPath: root('tsconfig.json'),
      entryModule: aotEntryModule
    }));

  if (!isTest && !isTestWatch) {
    config.plugins.push(
      // Generate common chunks if necessary
      // Reference: https://webpack.github.io/docs/code-splitting.html
      // Reference: https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
      new CommonsChunkPlugin({
        names: commonChunks.reverse()
      })
    );

    allEntries.filter(function(e) {return !!e.filter; }).forEach(function(entry) {
      let roots = entry.forRoot; //  TODO: if not set take all roots!
      config.plugins.push(new CommonsChunkPlugin({
        name: entry.name,
        chunks: roots,
        minChunks: (module, count) => {
          return count >= roots.length && isVendorChunk(module, entry.filter);
        }
      }));
    });
    
    // Inject script and link tags into html files
    // Reference: https://github.com/ampedandwired/html-webpack-plugin
    allEntries.filter(function(e) {return !!e.filename}).forEach(function(entry) {
      config.plugins.push(
        new HtmlWebpackPlugin({
          template: entry.template,
          filename: entry.filename,
          chunksSortMode: sortAs(chunksFor(allEntries, entry.name)),
          chunks: chunksFor(allEntries, entry.name)
        })
      );
    });

    // Extract css files
    // Reference: https://github.com/webpack/extract-text-webpack-plugin
    // Disabled when in test mode or not in build mode
    config.plugins.push(
      new ExtractTextPlugin({filename: 'css/' + cssName, disable: !isProd})
    );
  }

  // Add build specific plugins
  if (isProd) {
    config.plugins.push(
      // change angular code to allow for more aggressive tree-shaking:
      new PurifyPlugin(),

      // Reference: https://www.npmjs.com/package/uglifyjs-webpack-plugin
      // Minify all javascript, switch loaders to minimizing mode
      new UglifyJsPlugin({
        sourceMap: !!config.devtool,
        uglifyOptions: {
          ecma: 5,
          ie8: false,
          warning: false,
          mangle: true,
          compress: {
            pure_getters: true,
            passes: 3
          },
          output: {
            ascii_only: true,
            comments: false
          }
        }
      }),

      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.bundle\.css$/g,
        cssProcessor: require('cssnano'),
        cssProcessorOptions: {
          autoprefixer: false,
          zindex: false,
          discardComments: {removeAll: true}
        },
        canPrint: true
      }),

      // Long term caching improvements: https://webpack.js.org/guides/caching/
      // Generate module identifiers based on module names, instead of an a counter,
      // so that the id's are stable, and caching is more effective:
      new webpack.HashedModuleIdsPlugin(),
      // Extract the manifest into the html template, to improve cacheability
      // of chunks:
      new InlineChunkManifestHtmlWebpackPlugin({
        filename: target + '-manifest.json',
        dropAsset: true
      }),

      // Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
      // Only emit files when there are no errors
      new webpack.NoEmitOnErrorsPlugin()
    );
  }

  /**
   * Dev server configuration
   * Reference: http://webpack.github.io/docs/configuration.html#devserver
   * Reference: http://webpack.github.io/docs/webpack-dev-server.html
   */
  config.devServer = {
    contentBase: './src/public',
    index: 'material.html',
    historyApiFallback: {
      rewrites: [
        { from: /^\/material.*$/, to: '/material.html' }
      ]
    },
    quiet: true,
    stats: 'minimal' // none (or false), errors-only, minimal, normal (or true) and verbose
  };

  /*
   * Include polyfills or mocks for various node stuff
   * Description: Node configuration
   *
   * See: https://webpack.github.io/docs/configuration.html#node
   */
  config.node = {
    setImmediate: false
  };

  return config;
};

// Helper functions
function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [__dirname].concat(args));
}

function sortAs(list) {
  return function (chunk1, chunk2) {
    var order1 = list.indexOf(chunk1.names[0]);
    var order2 = list.indexOf(chunk2.names[0]);
    if (order1 > order2)
      return 1;
    else if (order1 < order2)
      return -1;
    return 0;
  }
}

function chunksFor(entries, name) {
  return entries.slice().filter(function(e) {
    if (e.name === name)
      return true; // the root which we include by default
    if (e.filename)
      return false; // filename indicates a root, so it's not a coomonchunk for another root
    return e.forRoot == null || e.forRoot.indexOf(name) != -1;
  }).map(function(e) {
    return e.name;
  });
}

function isVendorChunk({resource}, filter) {
  return resource && resource.replace(/\\/g, '/').match(filter);
}
