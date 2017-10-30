import resolve from 'rollup-plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';

const globals = {
    '@angular/common': 'ng.common',
    '@angular/core': 'ng.core',
    '@angular/forms': 'ng.forms',
    '@angular/router': 'ng.router',
    '@material/animation': 'mdc.animation',
    '@material/checkbox': 'mdc.checkbox',
    '@material/form-field': 'mdc.formField',
    '@material/icon-toggle': 'mdc.iconToggle',
    '@material/linear-progress': 'mdc.linearProgress',
    '@material/menu': 'mdc.menu',    
    '@material/radio': 'mdc.radio',
    '@material/ripple': 'mdc.ripple',
    '@material/select': 'mdc.select',
    '@material/slider': 'mdc.slider',
    '@material/switch': 'mdc.switch',
    '@material/snackbar': 'mdc.snackbar',
    '@material/textfield': 'mdc.textfield',
    '@material/toolbar': 'mdc.toolbar',
    '@material/tabs': 'mdc.tabs',
    'rxjs': 'Rx',
    'tslib': 'tslib'
};

export default {
    input: 'build/material.js',
    plugins: [
        resolve({jail: '/src'}),
        sourcemaps()
    ],
    onwarn: function(warning) {
        // Suppress known error message caused by TypeScript compiled code with Rollup
        // https://github.com/rollup/rollup/wiki/Troubleshooting#this-is-undefined
        if (warning.code !== 'THIS_IS_UNDEFINED')
            console.log("Rollup warning: ", warning.message);
    },
    sourcemap: true,
    output: [
        {file: 'dist/material.umd.js', format: 'umd', name: 'blox.material'},
        {file: 'dist/material.es5.js', format: 'es'}
    ],
    external: Object.keys(globals),
    globals: globals
};
