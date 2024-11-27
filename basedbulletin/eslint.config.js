import pkg from 'eslint';
const { defineConfig } = pkg;

export default defineConfig({
  extends: 'next/core-web-vitals',
  rules: {
    // Add any custom rules here
  },
  overrides: [
    {
      files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
      rules: {
        // Add any specific rules for these file types here
      },
      linterOptions: {
        reportUnusedDisableDirectives: true,
      },
    },
  ],
});
