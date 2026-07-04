#!/usr/bin/env node
/**
 * Extracts inline useThemedStyles factories into co-located styles/resolve*Styles.ts files.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(__dirname, '..', 'src');
const SKIP_DIRS = new Set(['node_modules', '__tests__']);
const targetArg = process.argv[2];

const toPascalCase = value =>
  value
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');

const deriveBaseName = filePath => {
  const dir = path.dirname(filePath);
  const base = path.basename(filePath, path.extname(filePath));
  return base === 'index' ? path.basename(dir) : base;
};

const deriveResolveName = (filePath, occurrenceIndex = 0) => {
  const base = deriveBaseName(filePath);
  const suffix = occurrenceIndex > 0 ? String(occurrenceIndex + 1) : '';
  return `resolve${toPascalCase(base)}Styles${suffix}`;
};

const skipString = (source, index, quote) => {
  let i = index + 1;
  while (i < source.length) {
    if (source[i] === '\\') {
      i += 2;
      continue;
    }
    if (source[i] === quote) return i;
    i += 1;
  }
  return source.length - 1;
};

const skipTemplate = (source, index) => {
  let i = index + 1;
  while (i < source.length) {
    if (source[i] === '\\') {
      i += 2;
      continue;
    }
    if (source[i] === '`') return i;
    if (source[i] === '$' && source[i + 1] === '{') {
      i += 2;
      let depth = 1;
      while (i < source.length && depth > 0) {
        if (source[i] === '{') depth += 1;
        else if (source[i] === '}') depth -= 1;
        i += 1;
      }
      continue;
    }
    i += 1;
  }
  return source.length - 1;
};

const skipLineComment = (source, index) => {
  let i = index + 2;
  while (i < source.length && source[i] !== '\n') i += 1;
  return i;
};

const skipBlockComment = (source, index) => {
  let i = index + 2;
  while (i < source.length - 1) {
    if (source[i] === '*' && source[i + 1] === '/') return i + 1;
    i += 1;
  }
  return source.length - 1;
};

const findMatchingBrace = (source, openIndex) => {
  let depth = 0;
  for (let i = openIndex; i < source.length; i += 1) {
    const char = source[i];
    if (char === '/' && source[i + 1] === '/') {
      i = skipLineComment(source, i);
      continue;
    }
    if (char === '/' && source[i + 1] === '*') {
      i = skipBlockComment(source, i);
      continue;
    }
    if (char === '"' || char === "'") {
      i = skipString(source, i, char);
      continue;
    }
    if (char === '`') {
      i = skipTemplate(source, i);
      continue;
    }
    if (char === '{') depth += 1;
    else if (char === '}') {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return -1;
};

const findMatchingParen = (source, openIndex) => {
  let depth = 0;
  for (let i = openIndex; i < source.length; i += 1) {
    const char = source[i];
    if (char === '/' && source[i + 1] === '/') {
      i = skipLineComment(source, i);
      continue;
    }
    if (char === '/' && source[i + 1] === '*') {
      i = skipBlockComment(source, i);
      continue;
    }
    if (char === '"' || char === "'") {
      i = skipString(source, i, char);
      continue;
    }
    if (char === '`') {
      i = skipTemplate(source, i);
      continue;
    }
    if (char === '(') depth += 1;
    else if (char === ')') {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return -1;
};

const skipWhitespace = (source, index) => {
  let i = index;
  while (i < source.length && /\s/.test(source[i])) i += 1;
  return i;
};

const extractStyleObjectAt = (source, fromIndex) => {
  let i = skipWhitespace(source, fromIndex);

  if (source.startsWith('StyleSheet.create', i)) {
    i = skipWhitespace(source, i + 'StyleSheet.create'.length);
    if (source[i] !== '(') return null;
    i = skipWhitespace(source, i + 1);
  } else if (source[i] === '(') {
    i = skipWhitespace(source, i + 1);
  }

  if (source[i] !== '{') return null;
  const closeBrace = findMatchingBrace(source, i);
  if (closeBrace === -1) return null;

  return source.slice(i, closeBrace + 1);
};

const findDynamicParams = styleBody => {
  const params = new Set();
  if (/\baccentColor\b/.test(styleBody)) params.add('accentColor?: string');
  return [...params];
};

const findUseThemedStylesCalls = source => {
  const calls = [];
  const pattern = /const\s+(\w+)\s*=\s*useThemedStyles\s*\(|=>\s*useThemedStyles\s*\(/g;
  let match;

  while ((match = pattern.exec(source)) !== null) {
    const hookStart = source.indexOf('useThemedStyles(', match.index);
    if (hookStart === -1) continue;

    const openParen = hookStart + 'useThemedStyles('.length - 1;
    const closeParen = findMatchingParen(source, openParen);
    if (closeParen === -1) continue;

    const inner = source.slice(openParen + 1, closeParen);
    const arrowIndex = inner.indexOf('=>');
    if (arrowIndex === -1) continue;

    const params = inner.slice(0, arrowIndex).trim();
    const afterArrowAbs = openParen + 1 + arrowIndex + 2;
    const styleBody = extractStyleObjectAt(source, afterArrowAbs);
    if (!styleBody) continue;

    let end = closeParen + 1;
    end = skipWhitespace(source, end);
    if (source[end] === ';') end += 1;

    const prefix = source.slice(match.index, hookStart);
    calls.push({
      replaceStart: match.index,
      end,
      prefix,
      params,
      styleBody,
    });
  }

  return calls;
};

const buildResolveFile = ({resolveName, styleBody, tokenParam, dynamicParams}) => {
  let normalizedBody = styleBody;
  if (tokenParam === 't') {
    normalizedBody = normalizedBody.replace(/\bt\./g, 'tokens.').replace(/\bt\b/g, 'tokens');
  } else if (tokenParam !== 'tokens') {
    normalizedBody = normalizedBody.replace(
      new RegExp(`\\b${tokenParam}\\b`, 'g'),
      'tokens',
    );
  }

  const dynamicArgNames = dynamicParams.map(param => param.replace(/\?:.*$/, ''));
  const paramList =
    dynamicParams.length > 0
      ? `tokens: ThemeTokens, ${dynamicParams.join(', ')}`
      : 'tokens: ThemeTokens';

  return `import type {ThemeTokens} from '@theme/types';

export const ${resolveName} = (${paramList}) => (${normalizedBody});
`;
};

const buildHookCall = ({resolveName, dynamicParams}) => {
  if (dynamicParams.length === 0) {
    return `useThemedStyles(${resolveName})`;
  }
  const argNames = dynamicParams.map(param => param.replace(/\?:.*$/, ''));
  const args = argNames.join(', ');
  return `useThemedStyles(tokens => ${resolveName}(tokens, ${args}), [${args}])`;
};

const ensureImport = (source, importLine) => {
  if (source.includes(importLine)) return source;

  const themeImportMatch = source.match(
    /import\s+\{[^}]+\}\s+from\s+['"]@theme\/createThemedStyles['"];\n/,
  );
  if (themeImportMatch) {
    const insertAt = themeImportMatch.index + themeImportMatch[0].length;
    return `${source.slice(0, insertAt)}${importLine}\n${source.slice(insertAt)}`;
  }

  const lastImportMatch = [...source.matchAll(/^import .+;\n/gm)].pop();
  if (lastImportMatch) {
    const insertAt = lastImportMatch.index + lastImportMatch[0].length;
    return `${source.slice(0, insertAt)}${importLine}\n${source.slice(insertAt)}`;
  }

  return `${importLine}\n${source}`;
};

const removeStyleSheetImportIfUnused = source => {
  if (/\bStyleSheet\b/.test(source)) return source;
  return source
    .replace(/,\s*StyleSheet/g, '')
    .replace(/StyleSheet,\s*/g, '')
    .replace(/import\s+\{\s*StyleSheet\s*\}\s+from\s+['"]react-native['"];\n/g, '');
};

const processFile = filePath => {
  const original = fs.readFileSync(filePath, 'utf8');
  const calls = findUseThemedStylesCalls(original);
  if (calls.length === 0) return {changed: false};

  let source = original;
  const dir = path.dirname(filePath);
  const stylesDir = dir.endsWith(`${path.sep}styles`)
    ? dir
    : path.join(dir, 'styles');
  const createdFiles = [];

  for (let i = calls.length - 1; i >= 0; i -= 1) {
    const call = calls[i];
    const tokenParam = call.params.replace(/^\(|\)$/g, '').trim() || 'tokens';
    const dynamicParams = findDynamicParams(call.styleBody);
    const resolveName = deriveResolveName(filePath, calls.length > 1 ? i : 0);
    const resolveFilePath = path.join(stylesDir, `${resolveName}.ts`);

    fs.mkdirSync(stylesDir, {recursive: true});
    fs.writeFileSync(
      resolveFilePath,
      buildResolveFile({
        resolveName,
        styleBody: call.styleBody,
        tokenParam,
        dynamicParams,
      }),
    );
    createdFiles.push(resolveFilePath);

    const relativeImport = stylesDir === dir
      ? `./${resolveName}`
      : `./styles/${resolveName}`;
    call.importLine = `import {${resolveName}} from '${relativeImport}';`;

    const hookCall = buildHookCall({resolveName, dynamicParams});
    source = `${source.slice(0, call.replaceStart)}${call.prefix}${hookCall}${source.slice(call.end)}`;
  }

  for (const call of calls) {
    if (call.importLine) {
      source = ensureImport(source, call.importLine);
    }
  }

  source = removeStyleSheetImportIfUnused(source);

  if (source !== original) {
    fs.writeFileSync(filePath, source);
    return {changed: true, createdFiles};
  }

  return {changed: false};
};

const walk = dir => {
  const entries = fs.readdirSync(dir, {withFileTypes: true});
  const files = [];

  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
    } else if (/\.(tsx|ts)$/.test(entry.name) && !fullPath.includes(`${path.sep}styles${path.sep}`)) {
      files.push(fullPath);
    }
  }

  return files;
};

const main = () => {
  const files = targetArg
    ? [path.resolve(targetArg)]
    : walk(SRC);
  let changedCount = 0;
  let createdCount = 0;

  for (const file of files) {
    if (file.endsWith('createThemedStyles.tsx')) continue;
    if (file.endsWith(`${path.sep}styles${path.sep}index.tsx`)) continue;
    if (file.endsWith(`${path.sep}styles${path.sep}index.ts`)) continue;
    const result = processFile(file);
    if (result.changed) {
      changedCount += 1;
      createdCount += result.createdFiles?.length ?? 0;
      console.log(`Migrated: ${path.relative(SRC, file)}`);
    }
  }

  console.log(`\nDone. Updated ${changedCount} files, created ${createdCount} resolve style modules.`);
};

main();
