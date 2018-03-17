# Euchre

A Euchre game and simulator in TypeScript and HTML

## Getting Started

You can use Visual Studio or Visual Studio Code. We've done more to integrate well with Visual Studio Code, so that's what is covered here.

### Installing software
Get [Visual Studio Code](https://code.visualstudio.com/) and [Node.js](https://nodejs.org/en/download/package-manager/) if you don't have them already.

If you want unit test failures to show up as issues in VS Code, you will also want [awk](http://gnuwin32.sourceforge.net/packages/gawk.htm). Once it's installed, set it up in your PATH so you can just run awk at the command line. In Windows 10:
1. Type "environment" into the start menu, then select "Edit environment variables for your account" or "Edit the system environment variables"
2. Click the Environment Variables button on the popup that opens
3. Click PATH in the appropriate list, then click Edit
4. Click new, then enter the Gawk installation directory (typically C:\Program Files (x86)\GnuWin32\bin)
5. Click OK on all the popups you opened
6. (optional) To verify that you did it right, open a new command prompt window and type "awk". If you get usage information, you're good to go.

**You will need to reboot before VS Code's terminal picks up on changes to PATH**

Run npm install in the project directory to get the needed dependencies.

### VS Code Tasks
Run via Tasks -> Run Task
* Start continuous build: builds all TypeScript files in watch mode (will build as you modify things).
* Start continuous integration: runs all unit tests in watch mode (will run again as you modify things). Test failures will show up as issues (requires awk).
* Run mutation tests: runs all mutation tests (once), and opens the report if it succeeds.
