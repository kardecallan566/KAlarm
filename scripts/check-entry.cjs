#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { createRequire } = require('node:module');

const projectRoot = path.resolve(__dirname, '..');
const manifestPath = path.join(projectRoot, 'package.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const entry = path.resolve(projectRoot, manifest.main || '');

function fail(problem) {
  console.error('\n[KAlarm] ' + problem);
  console.error('[KAlarm] Abra o terminal na raiz do repositório KAlarm e execute:');
  console.error('  pnpm install');
  console.error('  pnpm run check:entry');
  console.error('  pnpm start:clear\n');
  process.exit(1);
}

if (!manifest.main || !fs.existsSync(entry)) {
  fail('A entrada configurada em package.json (main) não existe: ' + manifest.main);
}
if (!fs.existsSync(path.join(projectRoot, 'node_modules'))) {
  fail('Dependências não instaladas nesta pasta (node_modules ausente).');
}

const projectRequire = createRequire(manifestPath);
for (const specifier of ['expo/package.json', 'expo-router/entry']) {
  try {
    projectRequire.resolve(specifier);
  } catch (error) {
    fail('O pacote/entry "' + specifier + '" não pôde ser resolvido. Verifique a instalação pelo pnpm. Detalhe: ' + error.code);
  }
}

console.log('[KAlarm] Entrada e dependências do Expo Router resolvidas com sucesso.');
