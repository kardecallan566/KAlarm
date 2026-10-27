'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const exists = name => fs.existsSync(path.join(root, name));

test('Raiz contém um projeto Expo completo', () => {
  const pkg = require('../package.json');
  const config = require('../app.json');
  assert.ok(pkg.dependencies.expo && pkg.dependencies['expo-router']);
  assert.equal(pkg.main, './index.js');
  assert.equal(config.expo.name, 'KAlarm');
  assert.equal(config.expo.android.package, 'com.kardec.kalarm');
  for (const name of ['index.js', 'tsconfig.json', 'metro.config.js', 'eas.json',
    'app/_layout.tsx', 'app/(tabs)/index.tsx', 'src/theme.ts', 'src/data/schema.ts']) {
    assert.ok(exists(name), 'Arquivo ausente: ' + name);
  }
});

test('Assets continuam acessíveis a partir da raiz', () => {
  const config = require('../app.json').expo;
  assert.ok(exists(config.icon), 'Icone principal indisponivel');
  const splashPlugin = config.plugins.find(x => Array.isArray(x) && x[0] === 'expo-splash-screen');
  assert.ok(splashPlugin, 'Plugin expo-splash-screen ausente');
  assert.ok(exists(splashPlugin[1].image), 'Splash indisponivel');
  assert.equal(splashPlugin[1].backgroundColor, '#F7FAF8');
  assert.ok(exists(config.android.adaptiveIcon.foregroundImage), 'Adaptive icon indisponivel');
  assert.ok(exists('assets/softcare/manifest.json'));
});

test('Pasta antiga mobile não deve existir na raiz', () => {
  assert.equal(exists('mobile'), false,
    'O projeto Expo precisa ficar na raiz, não mais em mobile/');
});

test('Workspace pnpm e verificador de entrada usam somente a raiz', () => {
  assert.ok(exists('pnpm-workspace.yaml'));
  const checker = fs.readFileSync(path.join(root, 'scripts/check-entry.cjs'), 'utf8');
  assert.doesNotMatch(checker, /KAlarm\/mobile/);
  const pkg = require('../package.json');
  assert.match(pkg.scripts.android, /expo run:android/);
  assert.match(pkg.scripts['start:go:safe'], /run-go/);
});

test('O typecheck Expo ignora as provas independentes de agendamento', () => {
  const cfg = require('../tsconfig.json');
  assert.ok(cfg.include.some(x => x.startsWith('app/')));
  assert.ok(cfg.include.some(x => x.startsWith('src/')));
  assert.ok(cfg.exclude.includes('proofs'));
  assert.ok(cfg.compilerOptions.strict);
});

test('O workflow GitHub Actions executa pnpm e Expo na raiz', () => {
  const yml = fs.readFileSync(path.join(root, '.github/workflows/logic-tests.yml'), 'utf8');
  assert.doesNotMatch(yml, /working-directory:\s*mobile/);
  assert.doesNotMatch(yml, /node mobile\/scripts\//);
  assert.match(yml, /pnpm install/);
  assert.match(yml, /expo export --platform android/);
});

test('Manifesto usa Expo SDK 58, React Native 0.88 e React 19.3', () => {
  const pkg = require('../package.json');
  assert.match(pkg.dependencies.expo, /58/);
  assert.equal(pkg.dependencies.react, '19.3.0');
  assert.equal(pkg.dependencies['react-native'], '0.88.0');
  assert.match(pkg.dependencies['expo-router'], /58/);
  assert.match(pkg.dependencies['expo-sqlite'], /58/);
  assert.match(pkg.dependencies['expo-notifications'], /58/);
  assert.match(pkg.scripts.start, /--go/);
  assert.match(pkg.scripts['start:dev'], /--dev-client/);
});
