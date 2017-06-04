import resolve from 'rollup-plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';

export default {
    entry: 'build/material.js',
    plugins: [
        resolve(),
        sourcemaps()
    ],
    onwarn: function(warning) {
        // Suppress known error message caused by TypeScript compiled code with Rollup
        // https://github.com/rollup/rollup/wiki/Troubleshooting#this-is-undefined
        if (warning.code !== 'THIS_IS_UNDEFINED')
            console.log("Rollup warning: ", warning.message);
    },
    targets: [
        //{dest: 'dist/material.umd.js' , format: 'umd', moduleName: 'blox.material'},
        {dest: 'dist/material.es5.js', format: 'es'}
    ],
    external: [
        '@angular/common',
        '@angular/core',
        '@angular/forms',
        '@material/animation',
        '@material/checkbox',
        '@material/form-field',
        '@material/radio',
        '@material/ripple',
        '@material/snackbar',
        '@material/textfield',
        '@material/toolbar'
    ]
};
