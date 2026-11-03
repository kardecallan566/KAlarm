#!/usr/bin/env node
'use strict';
const { readFileSync } = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
const expo = require(path.join(root, 'node_modules/expo/package.json'));
const react = require(path.join(root, 'node_modules/react/package.json'));
const native = require(path.join(root, 'node_modules/react-native/package.json'));
const router = require(path.join(root, 'node_modules/expo-router/package.json'));
const installed = {expo:expo.version,react:react.version,'react-native':native.version,'expo-router':router.version};
const expected = {expo:'58.',react:'19.3.', 'react-native':'0.88.', 'expo-router':'58.'};
for(const [name,version] of Object.entries(installed)){
  if(!version.startsWith(expected[name])) {
    console.error('[KAlarm] Versão incompatível de '+name+': '+version+'. Esperado: '+expected[name]+'x');
    console.error('Execute pnpm install e pnpm exec expo install --fix na raiz do KAlarm.');
    process.exit(1);
  }
}
if(!pkg.scripts.start.includes('--go') || !pkg.scripts['start:dev'].includes('--dev-client')){
  throw new Error('Scripts precisam selecionar Expo Go e Development Build explicitamente.');
}
console.log('[KAlarm] SDK 58 confirmado: '+Object.entries(installed).map(([k,v])=>k+' '+v).join(' | '));
