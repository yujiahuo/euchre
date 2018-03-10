# Euchre

A Euchre game and simulator in TypeScript and HTML

## Getting Started

You can use Visual Studio or Visual Studio Code. We've done more to integrate well with Visual Studio Code, so that's what is covered here.

Get [Visual Studio Code](https://code.visualstudio.com/) and [Node.js](https://nodejs.org/en/download/package-manager/) if you don't have them already. If you want unit test failures to show up as issues in VS Code, you will also want [awk](http://gnuwin32.sourceforge.net/packages/gawk.htm), set up with your PATH so you can just run awk at the command line.

Run npm install in the project directory to get the needed dependencies.

### VS Code Tasks
Run via Tasks -> Run Task
* Start continuous build: builds all TypeScript files in watch mode (will build as you modify things).
* Start continuous integration: runs all unit tests in watch mode (will run again as you modify things). Test failures will show up as issues (requires awk).
* Run mutation tests: runs all mutation tests (once), and opens the report if it succeeds.
