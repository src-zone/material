import { rollup, InputOptions, OutputOptions } from 'rollup';
const resolve = require('@rollup/plugin-node-resolve');
const sourcemaps = require('rollup-plugin-sourcemaps');

const globals = {
  '@angular/common': 'ng.common',
  '@angular/core': 'ng.core',
  '@angular/forms': 'ng.forms',
  '@angular/router': 'ng.router',
  '@material/animation': 'mdc.animation',
  '@material/checkbox': 'mdc.checkbox',
  '@material/chips': 'mdc.chips',
  '@material/dialog': 'mdc.dialog',
  '@material/dom': 'mdc.dom',
  '@material/dom/announce': 'mdc.dom',
  '@material/drawer': 'mdc.drawer',
  '@material/floating-label': 'mdc.floatingLabel',
  '@material/form-field': 'mdc.formField',
  '@material/icon-button': 'mdc.iconButton',
  '@material/icon-toggle': 'mdc.iconToggle',
  '@material/linear-progress': 'mdc.linearProgress',
  '@material/line-ripple': 'mdc.lineRipple',
  '@material/list': 'mdc.list',
  '@material/menu': 'mdc.menu',
  '@material/menu/util': 'mdc.menu',
  '@material/menu-surface': 'mdc.menuSurface',
  '@material/notched-outline': 'mdc.notchedOutline',
  '@material/radio': 'mdc.radio',
  '@material/ripple': 'mdc.ripple',
  '@material/select': 'mdc.select',
  '@material/slider': 'mdc.slider',
  '@material/switch': 'mdc.switch',
  '@material/snackbar': 'mdc.snackbar',
  '@material/snackbar/util': 'mdc.snackbar',
  '@material/textfield': 'mdc.textfield',  // checked, not exported as mdc.textField yet
  '@material/toolbar': 'mdc.toolbar',
  '@material/top-app-bar': 'mdc.topAppBar',
  '@material/tab': 'mdc.tab',
  '@material/tab-bar': 'mdc.tabBar',
  '@material/tab-indicator': 'mdc.tabIndicator',
  '@material/tab-scroller': 'mdc.tabScroller',
  'rxjs': 'rxjs', 
  'rxjs/operators': 'rxjs.operators',
  'tslib': 'tslib'
};

const inputOptions: InputOptions = {
    input: 'build/material.js',
    plugins: [
        resolve({jail: '/src', modulesOnly: true}),
        sourcemaps()        
    ],
    onwarn: function(warning) {
        // Suppress known error message caused by TypeScript compiled code with Rollup
        // https://github.com/rollup/rollup/wiki/Troubleshooting#this-is-undefined
        if (typeof warning === 'string')
            console.log("Rollup warning: ", warning)
        else if (!skipWarning(warning))
            console.log("Rollup warning [", warning.code, "]: ", warning.message);
    },
    external: Object.keys(globals)
};
const outputOptionsEs5: OutputOptions = {
    file: 'dist/material.es5.js',
    format: 'es',
    sourcemap: true,
    globals: globals
};
const outputOptionsUmd: OutputOptions = {
    file: 'dist/material.umd.js',
    format: 'umd',
    sourcemap: true,
    globals: globals,
    name: 'blox.material'
};

async function build(writeOptions: OutputOptions) {
  const bundle = await rollup(inputOptions);
  await bundle.write(writeOptions);
}

function skipWarning(warning) {
    if (warning.code === 'THIS_IS_UNDEFINED' || warning.code === 'UNUSED_EXTERNAL_IMPORT')
        return true;
    // if (warning.code === 'CIRCULAR_DEPENDENCY')
    //     // NGC adds circular dependencies for every service with the "providedIn: 'root'" annotation,
    //     // we don't want to see them ;-):
    //     return (warning.message && (
    //         warning.message.endsWith('.service.js -> build\\material.module.js') ||
    //         warning.message.endsWith('.registry.js -> build\\material.module.js')));
    return false;
}

build(outputOptionsEs5);
build(outputOptionsUmd);

