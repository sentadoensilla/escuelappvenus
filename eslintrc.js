module.exports = {
	env: {
		browser: true,
		es2022: true,
	},
	settings: {
		react: {
			pragma: "React",
			version: 'detect',
		},
	},
	extends: [
		'plugin:react/recommended',
		'plugin:react/jsx-runtime',
		'standard',
		'eslint-config-prettier',
	],
	overrides: [],
    parserOptions: {
        ecmaVersion: 6,
        sourceType: "module",
        ecmaFeatures: {
            "jsx": true,
            "modules": true,
            "experimentalObjectRestSpread": true
        }
    },
	plugins: ['react'],
	rules: {
		"react/prop-types": "off",
        "comma-dangle": 0,
        "react/jsx-uses-vars": 1,
        "react/display-name": 1,
        "no-unused-vars": "warn",
        "no-console": 1,
        "no-unexpected-multiline": "warn"
	},
};
