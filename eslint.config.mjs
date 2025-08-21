import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import globals from 'globals'

const eslintConfig = [
  {
    languageOptions: {
      parser: tsParser,
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      'react': reactPlugin,
      'react-hooks': reactHooksPlugin,
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_*$',
          varsIgnorePattern: '^_*$',
          caughtErrorsIgnorePattern: '^_*$',
        },
      ],
      'arrow-body-style': ['error', 'as-needed'],
      'linebreak-style': ['error', 'unix'],
      'max-len': [
        'error',
        { code: 80, ignoreRegExpLiterals: true, ignoreStrings: true },
      ],
      'no-console': [
        'error',
        { allow: ['debug', 'error', 'info', 'trace', 'warn'] },
      ],
      'no-template-curly-in-string': 'off',
      'object-shorthand': ['error', 'always'],
      'quote-props': ['warn', 'consistent-as-needed'],
      'quotes': [
        'error',
        'single',
        { allowTemplateLiterals: true, avoidEscape: true },
      ],
      'react/jsx-curly-brace-presence': ['error', 'always'],
      'react/self-closing-comp': ['error', { component: true, html: true }],
    },
    ignores: [
      '**/build/**',
      '**/.strapi*',
      '**/.next/**',
      '**/back/scripts/**',
      '**/*.d.ts',
      '**/*.yml',
      '**/*.pkg',
      '**/generated/*',
      '**/dist/**',
      '**/.yarn/',
      '**/webpack.config.dev.js',
      '**/webpack.config.prod.js',
      '*.xml',
    ],
  },
]

export default eslintConfig
