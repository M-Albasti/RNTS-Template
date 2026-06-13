#!/usr/bin/env node
/**
 * Copies Inter + Cairo TTF files from @expo-google-fonts packages into src/assets/fonts/.
 * Run after `bun install` if font files are missing: `bun run copy-fonts`
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const targets = [
  {
    from: 'node_modules/@expo-google-fonts/inter/400Regular/Inter_400Regular.ttf',
    to: 'src/assets/fonts/Inter/Inter-Regular.ttf',
  },
  {
    from: 'node_modules/@expo-google-fonts/inter/600SemiBold/Inter_600SemiBold.ttf',
    to: 'src/assets/fonts/Inter/Inter-SemiBold.ttf',
  },
  {
    from: 'node_modules/@expo-google-fonts/inter/700Bold/Inter_700Bold.ttf',
    to: 'src/assets/fonts/Inter/Inter-Bold.ttf',
  },
  {
    from: 'node_modules/@expo-google-fonts/cairo/400Regular/Cairo_400Regular.ttf',
    to: 'src/assets/fonts/Cairo/Cairo-Regular.ttf',
  },
  {
    from: 'node_modules/@expo-google-fonts/cairo/600SemiBold/Cairo_600SemiBold.ttf',
    to: 'src/assets/fonts/Cairo/Cairo-SemiBold.ttf',
  },
  {
    from: 'node_modules/@expo-google-fonts/cairo/700Bold/Cairo_700Bold.ttf',
    to: 'src/assets/fonts/Cairo/Cairo-Bold.ttf',
  },
];

for (const {from, to} of targets) {
  const source = path.join(root, from);
  const dest = path.join(root, to);
  fs.mkdirSync(path.dirname(dest), {recursive: true});
  fs.copyFileSync(source, dest);
  console.log(`Copied ${to}`);
}

console.log('Done. Run: bun run link-assets && rebuild the app.');
