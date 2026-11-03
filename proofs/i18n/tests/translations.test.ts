import test from 'node:test';
import assert from 'node:assert/strict';
import {ptBR,enUS,dictionaries} from '../../../src/i18n/translations.ts';

test('Português do Brasil é o idioma padrão completo',()=>{
 assert.equal(ptBR['settings.languageTitle'],'Idioma do aplicativo');
 assert.equal(dictionaries['pt-BR'],ptBR);
 assert.equal(Object.keys(ptBR).length,Object.keys(enUS).length);
});

test('todos os textos do português possuem equivalente em inglês',()=>{
 assert.deepEqual(Object.keys(ptBR).sort(),Object.keys(enUS).sort());
 for(const [key,value] of Object.entries(enUS))assert.ok(value.trim(),`Tradução vazia: ${key}`);
});

test('idiomas oferecem rótulos claros para as configurações e navegação',()=>{
 assert.equal(ptBR['common.settings'],'Configurações');
 assert.equal(enUS['common.settings'],'Settings');
 assert.equal(ptBR['tabs.home'],'Início');
 assert.equal(enUS['tabs.home'],'Home');
 assert.equal(ptBR['settings.languagePt'],'Português (Brasil)');
 assert.equal(enUS['settings.languageEn'],'English');
});
