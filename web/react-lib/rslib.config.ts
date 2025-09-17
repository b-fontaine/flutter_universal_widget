import {pluginReact} from '@rsbuild/plugin-react';
import {defineConfig} from '@rslib/core';
// @ts-ignore
import pkg from './package.json' assert { type: 'json' };

export default defineConfig({
    source: {
        entry: {
            index: ['./src/**'],

        },
        define: {
            __PKG_NAME__: JSON.stringify(pkg.name),
            __PKG_VERSION__: JSON.stringify(pkg.version),
        },
    },
    lib: [
        {
            bundle: false,
            dts: true,
            format: 'esm',
        },
    ],
    output: {
        target: 'web',
    },
    plugins: [pluginReact()],
});
