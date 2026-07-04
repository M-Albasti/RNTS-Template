#!/usr/bin/env node
/**
 * Validates translation JSON files parse and contain required top-level keys.
 */
import {readFileSync} from 'node:fs';
import {join, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const locales = ['en', 'ar'];
const requiredKeys = ['home', 'services', 'common', 'tabs'];

let failed = false;

for (const locale of locales) {
  const file = join(root, 'src', 'translation', locale, 'index.json');
  try {
    const data = JSON.parse(readFileSync(file, 'utf8'));
    for (const key of requiredKeys) {
      if (data[key] == null) {
        console.error(`[i18n] ${locale}: missing top-level key "${key}"`);
        failed = true;
      }
    }
    console.log(`[i18n] ${locale}: OK (${Object.keys(data).length} keys)`);
  } catch (error) {
    console.error(`[i18n] ${locale}: invalid JSON — ${error.message}`);
    failed = true;
  }
}

if (failed) {
  process.exit(1);
}
