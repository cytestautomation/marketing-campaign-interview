const report = require('multiple-cucumber-html-reporter');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const rimraf = require('rimraf');

const cucumberJsonDir = 'cypress/results/cucumber/json';
const cucumberReportFileMap = {};
const cucumberReportMap = {};
const jsonIndentLevel = 2;
const htmlReportDir = 'cypress/results/cucumber/json';
const screenshotsDir = 'cypress/screenshots';
const runResultsDir = 'cypress/results/.run';

getCucumberReportMaps();
addScreenshots();
generateReport();
deleteRunResult();

function getCucumberReportMaps() {
  const files = fs.readdirSync(cucumberJsonDir).filter((file) => {
    return file.indexOf('.json') > -1;
  });

  files.forEach((file) => {
    const json = JSON.parse(fs.readFileSync(path.join(cucumberJsonDir, file)));
    if (!json[0]) {
      return;
    }

    const [feature] = json[0].uri.split('/').reverse();
    cucumberReportFileMap[feature] = file;
    cucumberReportMap[feature] = json;
  });
}

function addScreenshots() {
  // Prepend the given path segment
  const prependPathSegment = (pathSegment) => (location) =>
    path.join(pathSegment, location);

  // fs.readdir but with relative paths
  const readdirPreserveRelativePath = (location) =>
    fs.readdirSync(location).map(prependPathSegment(location));

  // Recursive fs.readdir but with relative paths
  const readdirRecursive = (location) =>
    readdirPreserveRelativePath(location).reduce(
      (result, currentValue) =>
        fs.statSync(currentValue).isDirectory()
          ? result.concat(readdirRecursive(currentValue))
          : result.concat(currentValue),
      []
    );

  const screenshots = readdirRecursive(path.resolve(screenshotsDir)).filter(
    (file) => {
      return file.indexOf('.png') > -1;
    }
  );

  // Extract feature list from screenshot list
  const featuresList = Array.from(
    new Set(screenshots.map((x) => x.match(/[\w-_.]+\.feature/g)[0]))
  );
  featuresList.forEach((feature) => {
    screenshots.forEach((screenshot) => {
      // regex to parse 'I can use scenario outlines with examples' from either of these:
      // - Getting Started -- I can use scenario outlines with examples (example #1) (failed).png
      // - Getting Started -- I can use scenario outlines with examples (failed).png
      // - Getting Started -- I can use scenario outlines with examples.png

      const regex =
        /(?<=--\ ).+?((?=\ \(example\ #\d+\))|(?=\ \(failed\))|(?=\.\w{3}))/g;

      const [scenarioName] = screenshot.match(regex);
      console.info(
        chalk.blue('\n Adding screenshot to cucumber-json report for')
      );
      console.info(chalk.blue(` '${scenarioName}'`));

      // Find all scenarios matching the scenario name of the screenshot.
      // This is important when using the scenario outline mechanism
      const myScenarios = cucumberReportMap[feature][0].elements.filter((e) =>
        scenarioName.includes(e.name)
      );
      if (!myScenarios) {
        return;
      }

      let foundFailedStep = false;
      myScenarios.forEach((myScenario) => {
        if (foundFailedStep) {
          return;
        }

        let myStep;
        if (screenshot.includes('(failed)')) {
          myStep = myScenario.steps.find(
            (step) => step.result.status === 'failed'
          );
        } else {
          myStep = myScenario.steps.find((step) =>
            step.name.includes('screenshot')
          );
        }

        if (!myStep) {
          return;
        }

        const data = fs.readFileSync(path.resolve(screenshot));

        if (data) {
          const base64Image = Buffer.from(data, 'binary').toString('base64');
          if (!myStep.embeddings) {
            myStep.embeddings = [];
            myStep.embeddings.push({
              data: base64Image,
              mime_type: 'image/png',
            });
            foundFailedStep = true;
          }
        }
      });

      //Write JSON with screenshot back to report file.
      fs.writeFileSync(
        path.join(cucumberJsonDir, cucumberReportFileMap[feature]),
        JSON.stringify(cucumberReportMap[feature], null, jsonIndentLevel)
      );
    });
  });
}

function mapOs(os) {
  if (os.startsWith('win')) {
    return 'windows';
  } else if (os.startsWith('osx')) {
    return 'osx';
  } else if (os.startsWith('linux')) {
    return 'linux';
  } else if (os.startsWith('ubuntu')) {
    return 'ubuntu';
  } else if (os.startsWith('android')) {
    return 'android';
  } else if (os.startsWith('ios')) {
    return 'ios';
  }
}

function generateReport() {
  if (!fs.existsSync(cucumberJsonDir)) {
    console.warn(
      chalk.yellow(
        `WARNING: Folder './${cucumberJsonDir}' not found. REPORT CANNOT BE CREATED!`
      )
    );
    return;
  }

  const runInfos = JSON.parse(
    fs.readFileSync(path.join(runResultsDir, 'results.json'))
  );

  report.generate({
    jsonDir: 'cypress/results/cucumber/json',
    reportPath: 'cypress/reports/cucumber',
    metadata: {
      browser: {
        name: runInfos.browserName,
        version: runInfos.browserVersion,
      },
      device: 'Local test machine',
      platform: {
        name: mapOs(runInfos.osName),
        version: runInfos.osVersion,
      },
    },
    customData: {
      title: 'Run info',
      data: [
        { label: 'Project', value: 'Profit And Loss' },
        { label: 'Release', value: '3.5.0' },
        { label: 'Cycle', value: 'B11221.34321' },
        {
          label: 'Execution Start Time',
          value: new Date(runInfos.startedTestsAt).toLocaleString(),
        },
        {
          label: 'Execution End Time',
          value: new Date(runInfos.endedTestsAt).toLocaleString(),
        },
      ],
    },
    pageTitle: 'System-Test Report',
    reportName: `System-Test Report - ${new Date().toLocaleString()}`,
    displayDuration: true,
    displayReportTime: true,
  });
}

function deleteRunResult() {
  rimraf(runResultsDir, () => {
    console.log('Deleted former test results.');
  });
}
