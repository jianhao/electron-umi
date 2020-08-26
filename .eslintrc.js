module.exports = {
  extends: [require.resolve('@umijs/fabric/dist/eslint')],
  rules: {
    'react/jsx-first-prop-new-line': 'error',
    'react/jsx-max-props-per-line': [
      'error',
      {
        maximum: 1,
        when: 'multiline',
      },
    ],
    'react/jsx-closing-bracket-location': [
      'error',
      {
        nonEmpty: 'tag-aligned',
        selfClosing: 'tag-aligned',
      },
    ],
    semi: ['error', 'never'],
    indent: ['error', 2, { SwitchCase: 1 }],
    'no-plusplus': 'off',
    'react/sort-comp': 'off',
    'no-unused-expressions': 'off',
  },
}
