import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import prettierConfig from 'eslint-config-prettier';
import noOnlyTests from 'eslint-plugin-no-only-tests';
import sortImports from 'eslint-plugin-simple-import-sort';

/**
 * Custom inline rule: allow `const` only for SCREAMING_CASE identifiers
 */
let constScreamingCaseOnly = {
  meta: {
    type: 'suggestion',
    fixable: 'code',
    docs: {
      description: 'Disallow const unless identifier is SCREAMING_CASE',
    },
  },
  create(context) {
    let sourceCode = context.sourceCode;

    return {
      VariableDeclaration(node) {
        if (node.kind !== 'const') return;

        // If ANY declarator is not SCREAMING_CASE identifier, we flag the WHOLE declaration
        let offending = node.declarations.find((decl) => {
          if (decl.id.type !== 'Identifier') return true; // disallow const with patterns by default
          return !/^[A-Z0-9_]+$/.test(decl.id.name);
        });

        if (!offending) return;

        context.report({
          node,
          message: 'Use `const` only for SCREAMING_CASE constants. Consider `let` here.',
          fix(fixer) {
            // Safely replace just the `const` keyword
            let constToken = sourceCode.getFirstToken(node); // should be "const" even in "export const ..."
            if (!constToken || constToken.value !== 'const') return null;
            return fixer.replaceText(constToken, 'let');
          },
        });
      },
    };
  },
};

let eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'coverage/**',
    'playwright-report/**',
    'test-results/**',
    'next-env.d.ts',
    '.*/**',
    'src/lib/server/db/prisma/.generated/**',
  ]),
  prettierConfig,
  {
    plugins: {
      'simple-import-sort': sortImports,
      'no-only-tests': noOnlyTests,
      // Inline plugin with one rule
      local: {
        rules: {
          // IMPORTANT: no "local/" prefix here
          'const-screaming-case-only': constScreamingCaseOnly,
        },
      },
    },
    rules: {
      'prefer-const': 'off',
      'local/const-screaming-case-only': 'error',

      // @next
      '@next/next/no-img-element': 'off',

      // @typescript-eslint
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: false,
          fixStyle: 'inline-type-imports',
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      // simple-import-sort
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      // no-only-tests
      'no-only-tests/no-only-tests': 'error',
    },
  },
]);

export default eslintConfig;
