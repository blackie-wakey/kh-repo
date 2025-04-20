// babel.config.js
import presetEnv from '@babel/preset-env';
import presetReact from '@babel/preset-react';
import presetTypescript from '@babel/preset-typescript';

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
            development: process.env.NODE_ENV === 'development',
        }],
        presetTypescript,
    ],
};
