# Edinburgh Short Term Let Application Collector

This script automates the collection of data about short term let applications in Edinburgh.

Recent applications are collected from the Edinburgh website and deposited into a Google Sheet.

## Usage

Install node dependencies.

```
npm install
```

Add a `.env` file to the root directory of the project.

```
GOOGLE_SERVICE_ACCOUNT="..."
SPREADSHEET_ID="..."
```

Run a search.

```
npx cypress run --spec cypress/e2e/search.cy.js
```

By default the search will collect all applications in the last 7 days. Pass an environment variable to change the number of days searched.

```
npx cypress run --spec cypress/e2e/search.cy.js --env days=90
```

When this is complete, it will save all matching applications in `./data/applications.json`.

Run the following command to add new applications to the Google Sheet.

```
npm run save
```