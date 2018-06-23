const path = require('path')

module.exports = {
  extends: ['standard'],
  env: {
    browser: true,
    node: true,
  },
  rules: {
    'no-console': 'off',
    'react/display-name': 'off',
    'comma-dangle': ['error', 'always-multiline'],
    'no-confusing-arrow': 'off',
    'import/unambiguous': 'off',
    semi: ['error', 'never'],
    'import/newline-after-import': 'error',
    'import/no-unresolved': 'off',
    'quote-props': ['error', 'consistent-as-needed'],
    'no-return-assign': 'off',
    'react/prop-types': 'off',
    'arrow-parens': ['error', 'always'],
    'space-before-function-paren': [
      'error',
      { anonymous: 'always', named: 'never', asyncArrow: 'always' },
    ],
  },
}
