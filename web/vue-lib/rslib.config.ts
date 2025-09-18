import {defineConfig} from '@rslib/core';
import {pluginUnpluginVue} from 'rsbuild-plugin-unplugin-vue';
// @ts-ignore
import pkg from './package.json' assert { type: 'json' };

export default defineConfig({
    source: {
        define: {
            __PKG_NAME__: JSON.stringify(pkg.name),
            __PKG_VERSION__: JSON.stringify(pkg.version),
        },
    },
    lib: [
        {
            bundle: false,
            format: 'esm',
        },
    ],
    output: {
        target: 'web',
    },
    plugins: [pluginUnpluginVue()],
});
