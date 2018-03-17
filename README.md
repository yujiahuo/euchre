# Euchre

A Euchre game and simulator in TypeScript and HTML

## Getting Started

You can use Visual Studio or Visual Studio Code. We've done more to integrate well with Visual Studio Code, so that's what is covered here.

### Installing software
Get [Visual Studio Code](https://code.visualstudio.com/),  [Node.js](https://nodejs.org/en/download/package-manager/), and [git](https://git-scm.com/downloads) if you don't have them already.

If you want unit test failures to show up as issues in VS Code, you will also want [awk](http://gnuwin32.sourceforge.net/packages/gawk.htm). Once it's installed, set it up in your PATH so you can just run awk at the command line. In Windows 10:
1. Type `environment` into the start menu, then select `Edit environment variables for your account` or `Edit the system environment variables`
2. Click the Environment Variables button on the popup that opens
3. Click PATH in the appropriate list, then click Edit
4. Click new, then enter the Gawk installation directory (typically `C:\Program Files (x86)\GnuWin32\bin`)
5. Click OK on all the popups you opened
6. (optional) To verify that you did it right, open a new command prompt window and type `awk`. If you get usage information, you're good to go.

**Note:** You will need to reboot before VS Code's terminal picks up on changes to PATH (some tasks will not work until you do)

Run `npm install` in the project directory to get the needed dependencies.

You should be prompted to install workspace-recommended extensions when you open the project in VS Code. If not, you can go to the Extensions tab, then click the more menu and Show Recommended Extensions to see the recommendations.

### VS Code Tasks
Run via Tasks -> Run Task
| Task                         | Description |
| ---                          | --- |
| tsc: build                   | Builds all TypeScript files (once). Also available via `Ctrl+Shift+B`. |
| tsc: watch                   | Builds all TypeScript files in watch mode (will re-build as you modify things). Also available via `Ctrl+Shift+B`. |
| Start continuous integration | Runs all unit tests in watch mode (will re-test as you modify things). Test failures will show up as issues (requires awk). |
| Run mutation tests           | Runs all mutation tests (once), and opens the report if it succeeds |

### Seeing code coverage
If you want to see code coverage decorations, press `Ctrl+Shift+P`, type `lcov`, and select `LCOV Menu`, then `Enable decorations`. This uses the data from the `Start continuous integration` task, and will update a few seconds after you save a file with the new coverage data.

If that doesn't change anything in the TypeScript files you have open, you may need to add another coverage path in `settings.json` (to the `lcov.path` setting). Add each folder under `coverage` to the array, and please send a pull request on GitHub with that change.
