import path from 'path';

/**
 * @param {string} file
 * @returns {string}
 */
function relativePath(file) {
  return `"${path.relative(process.cwd(), file)}"`;
}

function buildPrettierCommand(filenames) {
  return `prettier --check ${filenames.map(relativePath).join(' ')}`;
}

function buildEslintCommand(filenames) {
  return `eslint --fix ${filenames.map(relativePath).join(' ')}`;
}

let config = {
  '*.{js,mjs,jsx,ts,mts,tsx}': [buildPrettierCommand, buildEslintCommand],
  '*.{json,md,css}': [buildPrettierCommand],
};

export default config;
