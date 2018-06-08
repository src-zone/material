const { readdirSync, statSync } = require('fs');
const { join } = require('path');
const scopes = readdirSync('bundle/src/components');

module.exports = {
    extends: ['@commitlint/config-lerna-scopes'],
    rules: {
        'body-leading-blank': [1, 'always'],
        'scope-case': [2, 'always', 'lowerCase'],
        'subject-empty': [2, 'never'],
        'subject-full-stop': [2, 'never', '.'],
        'type-case': [2, 'always', 'lowerCase'],
        'type-empty': [2, 'never'],
        'scope-enum': ctx => [2, 'always', scopes],
        'type-enum': [
            2,
            'always',
            [
                'build',
                'ci',
                'docs',
                'feat',
                'fix',
                'perf',
                'refactor',
                'revert',
                'style',
                'test'
            ]
        ]
    }
};
