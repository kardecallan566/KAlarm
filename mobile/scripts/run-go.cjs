#!/usr/bin/env node
'use strict';

const { spawn } = require('node:child_process');

const smoke = process.argv.includes('--smoke');
const android = process.argv.includes('--android');
const clear = process.argv.includes('--clear') || smoke;
const env = {
  ...process.env,
  KALARM_EXPO_GO_SAFE: '1',
  EXPO_PUBLIC_KALARM_GO_SAFE: '1',
  EXPO_PUBLIC_KALARM_SMOKE: smoke ? '1' : '0',
};

console.log(smoke
  ? '[KAlarm] Teste mínimo: sem Expo Router, SQLite e notificações.'
  : '[KAlarm] Expo Go seguro: interface + SQLite; notificações desativadas somente neste modo.');
console.log('[KAlarm] Para alarmes reais: pnpm run android e pnpm start:dev.');

const args = ['exec', 'expo', 'start', '--go', ...(clear ? ['--clear'] : []), ...(android ? ['--android'] : [])];
const child = spawn(process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm', args, {
  env,
  stdio: 'inherit',
  shell: process.platform === 'win32',
});
child.on('error', error => {
  console.error('[KAlarm] Falha ao iniciar pnpm:', error.message);
  process.exitCode = 1;
});
child.on('exit', (code, signal) => {
  if (signal) {
    process.exitCode = 1;
    return;
  }
  process.exitCode = code ?? 1;
});
