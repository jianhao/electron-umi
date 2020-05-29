module.exports = {
  "extends": [require.resolve('@umijs/fabric/dist/eslint')],
  "rules": {
    "no-console": 0, // 不允许有 console
    "import/no-extraneous-dependencies": 0, // 判断是否是开发依赖，不太准确，所以禁用
    "arrow-spacing": ["error", { "before": true, "after": true }], // 箭头函数的箭头前后必须有空格
    "func-names": 0, // 允许使用匿名函数
    'no-unused-expressions': [ // 禁止无用的表达式
      'error',
      {
          allowShortCircuit: true,
          allowTernary: true,
          allowTaggedTemplates: true
      }
  ],
  }
}
