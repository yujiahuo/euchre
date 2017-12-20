// Karma configuration
// Generated on Sun Feb 19 2017 21:16:50 GMT-0600 (CST)

module.exports = function (config) {
	config.set({

		// base path that will be used to resolve all patterns (eg. files, exclude)
		basePath: 'EuchreSolution/',

		// frameworks to use
		// available frameworks: https://npmjs.org/browse/keyword/karma-adapter
		frameworks: ['jasmine', 'karma-typescript'],

		// list of files / patterns to load in the browser
		files: [
			'Euchre/lib/*.ts',
			'Euchre/GameScript/*.ts',
			'**/*.ts',
		],

		// list of files to exclude
		exclude: [
			'Euchre/AIScript/aiInterface.ts',
			'**/*.d.ts',
		],

		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {
			'**/*.ts': ['karma-typescript'],
		},

		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: ['dots', 'karma-typescript'],

		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_WARN,

		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,

		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: ['PhantomJS'],

		// Continuous Integration mode
		// if true, Karma captures browsers, runs the tests and exits
		singleRun: false,

		// Concurrency level
		// how many browser should be started simultaneous
		concurrency: Infinity,

		karmaTypescriptConfig: {
			reports: {
				'lcovonly': 'coverage'
			}
		},
	})
}
