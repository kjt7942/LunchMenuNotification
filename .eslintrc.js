module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'boundaries'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  settings: {
    'boundaries/elements': [
      { type: 'ui', pattern: 'src/domain/*/ui/**/*' },
      { type: 'runtime', pattern: 'src/domain/*/runtime/**/*' },
      { type: 'service', pattern: 'src/domain/*/service/**/*' },
      { type: 'repo', pattern: 'src/domain/*/repo/**/*' },
      { type: 'config', pattern: 'src/domain/*/config/**/*' },
      { type: 'types', pattern: 'src/domain/*/types/**/*' },
      { type: 'providers', pattern: 'src/providers/**/*' }
    ]
  },
  rules: {
    // Mechanical Enforcement: 레이어 종속성 강제 적용
    // 방향성: UI -> Runtime -> Service -> Repo -> Config -> Types 
    'boundaries/element-types': [
      2,
      {
        default: 'disallow',
        rules: [
          { from: 'ui', allow: ['runtime', 'service', 'repo', 'config', 'types', 'providers'] },
          { from: 'runtime', allow: ['service', 'repo', 'config', 'types', 'providers'] },
          { from: 'service', allow: ['repo', 'config', 'types', 'providers'] },
          { from: 'repo', allow: ['config', 'types', 'providers'] },
          { from: 'config', allow: ['types'] },
          { from: 'types', allow: [] },
          { from: 'providers', allow: ['types'] }
        ]
      }
    ]
  }
};
