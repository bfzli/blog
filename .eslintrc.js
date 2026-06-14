module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier'
    ],
    plugins: [
        '@typescript-eslint'
    ],
    globals: {
        dataLayer: 'readonly',
        ImageMetadata: 'readonly'
    },
    rules: {
        indent: [
            'error',
            4
        ],
        'linebreak-style': 'off',
        quotes: [
            'error',
            'single',
            { avoidEscape: true }
        ],
        semi: [
            'error',
            'never'
        ],
        'comma-dangle': [
            'error',
            'never'
        ],
        'jsx-quotes': [
            'error',
            'prefer-single'
        ],
        'eol-last': [
            'error',
            'never'
        ]
    },
    overrides: [
        {
            files: ['*.astro'],
            parser: 'astro-eslint-parser',
            parserOptions: { parser: '@typescript-eslint/parser', extraFileExtensions: ['.astro'] },
            extends: ['plugin:astro/recommended', 'plugin:astro/jsx-a11y-recommended']
        },
        {
            files: ['**/*.astro/*.js', '*.astro/*.js'],
            env: { browser: true, es2020: true },
            parserOptions: { sourceType: 'module' },
            rules: { 'prettier/prettier': 'off' }
        },
        {
            files: ['*.tsx'],
            parser: '@typescript-eslint/parser',
            plugins: ['solid'],
            extends: ['plugin:solid/typescript', 'plugin:jsx-a11y/recommended']
        },
    ],
    ignorePatterns: ['*rc.js', '*.config.js', '*.d.ts']
}
