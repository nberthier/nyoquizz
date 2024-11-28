import { fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import perfectionist from 'eslint-plugin-perfectionist';
// @ts-check
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  allConfig: js.configs.all,
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

const pluginsToPatch = [
  '@next/next',
  // Other plugins to patch, example :
  // "react-hooks",
];

const compatConfig = [
  ...compat.extends(
    'next/core-web-vitals',
    'next/typescript',
    'plugin:@next/next/recommended',
    'plugin:drizzle/recommended',
    'eslint:recommended',
    'plugin:prettier/recommended'
  ),
];

const patchedConfig = compatConfig.map((entry) => {
  const plugins = entry.plugins;
  for (const key in plugins) {
    if (
      Object.prototype.hasOwnProperty.call(plugins, key) &&
      pluginsToPatch.includes(key)
    ) {
      plugins[key] = fixupPluginRules(plugins[key]);
    }
  }
  return entry;
});

const config = [
  { ignores: ['.next/*'] },
  ...patchedConfig,
  perfectionist.configs['recommended-alphabetical'],
  eslintConfigPrettier,
];

export default config;
