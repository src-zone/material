import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
    entry: 'build/material.js',
    plugins: [
        resolve({jsnext: true, module: true, main: true, browser: true}),
        commonjs({
            include: 'node_modules/rxjs/**'
        })
    ],
    onwarn: function(warning) {
        // Suppress known error message caused by TypeScript compiled code with Rollup
        // https://github.com/rollup/rollup/wiki/Troubleshooting#this-is-undefined
        if (warning.code !== 'THIS_IS_UNDEFINED')
            console.log("Rollup warning: ", warning.message);
    },
    targets: [
        {dest: 'dist/material.umd.js' , format: 'umd', moduleName: '@blox/material'},
        {dest: 'dist/material.es5.js', format: 'es'}
    ]
};
