# Short Term Let Objecter

A React frontend that displays short-term let applications in Edinburgh and allows residents to submit objections.

## Usage

Install the dependencies.

```
npm install
```

Add a `.env` file to the root directory of the project.

```
GOOGLE_SERVICE_ACCOUNT="..."
SPREADSHEET_ID="..."
```

Get all planning applications from the spreadsheet and update the file in `public/applications.json`.

```
npm run get-applications
```

Run the application in development mode.

```
npm start
```

Or build the app for production to the `build` folder.

```
npm run build
```
