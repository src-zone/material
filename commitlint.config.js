module.exports = {
    extends: ['@commitlint/config-lerna-scopes'],
    rules: {
        'body-leading-blank': [1, 'always'],
        lang: [1, 'always', 'eng'],
        'scope-case': [2, 'always', 'lowerCase'],
        'subject-empty': [2, 'never'],
        'subject-full-stop': [2, 'never', '.'],
        'type-case': [2, 'always', 'lowerCase'],
        'type-empty': [2, 'never'],
        'scope-enum': ctx => [2, 'always', [
            'button',
            'card',
            'checkbox',
            'dialog',
            'drawer',
            'elevation',
            'fab',
            'focus-trap',
            'form-field',
            'icon-toggle',
            'linear-progress',
            'list',
            'menu',
            'radio',
            'ripple',
            'select',
            'slider',
            'snackbar',
            'switch',
            'tabs',
            'text-field',
            'toolbar',
            'utility',
            'utils'
        ]],
        'type-enum': [
            2,
            'always',
            [
                'build',
                'chore',
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
