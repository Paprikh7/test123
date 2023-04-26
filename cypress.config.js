const { defineConfig } = require("cypress");

module.exports = defineConfig({
  env:{
    username: 'tc',
    password: 'tZyl?OQC1PEq'
  },
  pageLoadTimeout: 10000,
  viewportWidth: 1980,
  viewportHeight: 1080,
  e2e: {
    chromeWebSecurity: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'https://infinica-training.cloud.infinica.com/infinica-business-designer',
    numTestsKeptInMemory: 0,
  },
})