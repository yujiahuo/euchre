module.exports = function(config) {
	config.set({
		files: [
			'EuchreSolution/Euchre/*Script/*.ts',
			'EuchreSolution/Euchre/Scripts/typings/**/*.ts',
		],
		testRunner: "karma",
		mutator: "typescript",
		transpilers: ["typescript"],
		reporter: ["html", "progress"],
		testFramework: "jasmine",
		coverageAnalysis: "off",  //Disabled until it works with transpilers
		mutate: [
			'EuchreSolution/Euchre/*Script/*.ts'
		],
		karmaConfigFile: "karma.conf.js",
		tsconfigFile: "EuchreSolution/Euchre/stryker-tsconfig.json",
		timeoutFactor: 3,
	});
};
