const { realpathSync } = require('fs');

module.exports = {
    preset: 'jest-preset-angular',
    setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],

    rootDir: realpathSync(__dirname),

    testMatch: ['**/+(*.)+(spec|test).+(ts|js)?(x)'],
    modulePaths: ['<rootDir>'],

    testPathIgnorePatterns: [
        '<rootDir>/node_modules/',
        '<rootDir>/dist/',
    ],

    collectCoverage: true,
    coverageDirectory: 'coverage/aquarismo-app',

    transformIgnorePatterns: [
        'node_modules/(?!@angular|@ngneat/spectator|rxjs|swiper|ssr-window|dom7)',
    ],
    moduleFileExtensions: ['ts', 'html', 'js', 'json', 'mjs'],
};