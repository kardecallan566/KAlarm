'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const Module = require('node:module');

const root = path.resolve(__dirname, '..');
const configPath = path.join(root, 'metro.config.js');

function loadConfig(safe) {
  const oldFlag = process.env.KALARM_EXPO_GO_SAFE;
  const oldLoad = Module._load;
  process.env.KALARM_EXPO_GO_SAFE = safe ? '1' : '0';
  Module._load = function(request, parent, isMain) {
    if (request === 'expo/metro-config') {
      return { getDefaultConfig: () => ({ resolver: {} }) };
    }
    return oldLoad.call(this, request, parent, isMain);
  };
  try {
    delete require.cache[require.resolve(configPath)];
    return require(configPath);
  } finally {
    Module._load = oldLoad;
    if (oldFlag === undefined) delete process.env.KALARM_EXPO_GO_SAFE;
    else process.env.KALARM_EXPO_GO_SAFE = oldFlag;
  }
}

test('Metro substitui expo-notifications somente no modo Expo Go seguro', () => {
  const cfg = loadConfig(true);
  const resolve = (context, moduleName, platform) => ({ type: 'delegated', moduleName, platform });
  const notification = cfg.resolver.resolveRequest({ resolveRequest: resolve }, 'expo-notifications', 'android');
  assert.equal(notification.type, 'sourceFile');
  assert.equal(path.basename(notification.filePath), 'expo-notifications-disabled.js');
  assert.ok(fs.existsSync(notification.filePath));
  assert.deepEqual(
    cfg.resolver.resolveRequest({ resolveRequest: resolve }, 'expo-sqlite', 'android'),
    { type: 'delegated', moduleName: 'expo-sqlite', platform: 'android' }
  );
});

test('Development Build não substitui expo-notifications por mock', () => {
  const cfg = loadConfig(false);
  assert.equal(cfg.resolver.resolveRequest, undefined);
});

test('Entradas dos modos normal e mínimo existem', () => {
  const entry = fs.readFileSync(path.join(root, 'index.js'), 'utf8');
  assert.match(entry, /EXPO_PUBLIC_KALARM_SMOKE/);
  assert.match(entry, /expo-router\/entry/);
  assert.ok(fs.existsSync(path.join(root, 'src/diagnostics/smokeEntry.js')));
});

test('Mock não simula permissões ou notificações reais', () => {
  const stub = fs.readFileSync(path.join(root, 'src/compat/expo-notifications-disabled.js'), 'utf8');
  assert.match(stub, /granted:\s*false/);
  assert.match(stub, /throw new Error\(warning\)/);
  assert.match(stub, /return \[\];/);
});

// Previne regressão: ambos os modos Android devem ser explícitos e nunca selecionar web.
test('Os scripts de Android têm destinos nativos explícitos', () => {
  const manifest = require('../package.json');
  assert.match(manifest.scripts['start:android:go:safe'], /--android/);
  assert.match(manifest.scripts['start:android:dev'], /--android/);
  assert.doesNotMatch(manifest.scripts['start:android:dev'], /--web/);
  const runner = fs.readFileSync(path.join(root, 'scripts/run-go.cjs'), 'utf8');
  assert.match(runner, /process\.argv\.includes\('--android'\)/);
  assert.match(runner, /\['--android'\]/);
});
