const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: 'cypress/cypress/e2e/**/*.cy.{js,jsx,ts,tsx}', // Ensure this pattern matches your test files

  },
});
