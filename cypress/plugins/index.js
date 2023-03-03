/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const fs = require('fs-extra');
const path = require('path');
const xlsxHelper = require('./read-xlsx');

const cucumber = require('cypress-cucumber-preprocessor').default;
const browserify = require('@cypress/browserify-preprocessor');
const resolve = require('resolve');

function getConfiguration(file) {
  const pathToConfigFile = path.resolve('cypress', 'config', `${file}.json`);

  return fs.readJson(pathToConfigFile);
}

function getConfigWithCredentials(environment, envConfig) {
  if (environment === 'dev') {
    return {
      ...envConfig,
      ...{
        env: {
          ...envConfig.env,
          username: process.env.USER_NAME,
          password: process.env.PASSWORD,
        },
      },
    };
  }

  return envConfig;
}

require('dotenv').config();

/**
 * @type {Cypress.PluginConfig}
 */
// eslint-disable-next-line no-unused-vars
module.exports = async (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  const options = {
    ...browserify.defaultOptions,
    typescript: resolve.sync('typescript', { baseDir: config.projectRoot }),
  };

  on('file:preprocessor', cucumber(options));
  on('after:run', (results) => {
    if (results) {
      fs.mkdirSync('cypress/results/.run', { recursive: true });
      fs.writeFile(
        'cypress/results/.run/results.json',
        JSON.stringify(results)
      );
    }
  });
  on('task', {
    readExcel: xlsxHelper.readExcelFile,
  });

  const environment = config.env.configFile || 'dev';
  const envConfig = await getConfiguration(environment);
  const envConfigWithCredentials = getConfigWithCredentials(
    environment,
    envConfig
  );

  return {
    ...config,
    ...envConfigWithCredentials,
  };
};
