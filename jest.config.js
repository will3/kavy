module.exports = {
	testEnvironment: './packages/jest-kavy/kavy-environment.js',
	setupFilesAfterEnv: [ './packages/jest-kavy/kavy-rerender.js' ]
};