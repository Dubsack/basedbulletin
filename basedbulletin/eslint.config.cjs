const { defineConfig } = require('eslint-define-config');

module.exports = defineConfig({
    // Define the settings for React
    settings: {
        react: {
            version: 'detect', // Automatically detect the react version
        },
    },
    // Define your custom rules
    rules: {
        // Your custom rules here
    },
    // Include plugins directly in the configuration
    plugins: {
        react: require('eslint-plugin-react'), // If you're using React
        '@typescript-eslint': require('@typescript-eslint/eslint-plugin'), // If you're using TypeScript
    },
    // Specify the parser
    parser: '@typescript-eslint/parser', // Use the TypeScript parser if you're using TypeScript
});
