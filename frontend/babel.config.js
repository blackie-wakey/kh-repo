// babel.config.js
import presetEnv from '@babel/preset-env';
import presetReact from '@babel/preset-react';
import presetTypescript from '@babel/preset-typescript';
import pluginDecorators from '@babel/plugin-proposal-decorators';
import pluginClassProps from '@babel/plugin-proposal-class-properties';

export default {
    presets: [
        [presetEnv, {
            targets: {
                browsers: ['> 0.5%', 'last 2 versions', 'not dead'],
                node: 'current',
            },
            useBuiltIns: 'usage',
            corejs: 3,
        }],
        [presetReact, {
            runtime: 'automatic',
            // eslint-disable-next-line no-undef
            development: process.env.NODE_ENV === 'development',
        }],
        presetTypescript,
    ],
    plugins: [
        [pluginDecorators, { version: 'legacy' }],
        [pluginClassProps, { loose: true }],
    ],
};
