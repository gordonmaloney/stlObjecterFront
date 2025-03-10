import fs from "fs";
import path from "path"; // Use path to correctly handle file paths
import { fileURLToPath } from "url"; // Needed to create __dirname equivalent
import { google } from "googleapis";
import { spreadsheetId, getCredentials } from "./helpers/google.js";

// Create the equivalent of __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("saving new apps...");

const newApplications = JSON.parse(
  await fs.promises.readFile(
    new URL("../data/applications.json", import.meta.url)
  )
);

const formatDate = (string) => {
  const date = new Date(string);
  return [
    date.getDate().toString().padStart(2, "0"),
    (date.getMonth() + 1).toString().padStart(2, "0"), // Month is 0-indexed, so add 1
    date.getFullYear(),
  ].join("-");
};

if (newApplications.length) {
  const scopes = ["https://www.googleapis.com/auth/spreadsheets"];
  const auth = getCredentials(scopes);
  const sheets = google.sheets({
    version: "v4",
    auth: auth,
  });

  // Clear the existing sheet data
  await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range: `A2:J9999`, // Clears the entire sheet below the header row
  });

  // Prepare new rows for adding to the sheet, using "link" instead of "url"
  const newRows = newApplications.map((newApplication) => {
    return [
      newApplication.proposal, // Title
      newApplication.link, // Link (updated)
      newApplication.postcode, // Postcode
      newApplication.address, // Address
      newApplication.refNo.replace("Ref. No: ", ""), // Reference
      formatDate(newApplication.received.replace("Received: ", "")), // Received
      formatDate(newApplication.validated.replace("Validated: ", "")), // Validated
      newApplication.status.replace("Status: ", ""), // Status
      newApplication.lat ? newApplication.lat.toString() : "", // Latitude as a string
      newApplication.lon ? newApplication.lon.toString() : "", // Longitude as a string
    ];
  });

  // Update the sheet with the new rows
  if (newRows.length) {
    const rowStart = 2; // Start from row 2 (keeping header intact)
    const rowEnd = rowStart + newRows.length - 1;
    const response = await sheets.spreadsheets.values.update({
      spreadsheetId,
      range: `A${rowStart}:J${rowEnd}`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: newRows,
      },
    });

    console.log(
      `Successfully updated rows ${rowStart} to ${rowEnd}`,
      response.status
    );
  }

  // Step 2: Save the same data as a plain array for the frontend

  // Convert the data into a plain exportable array format, changing "url" to "link"
  const modifiedApplications = newApplications.map((app) => ({
    ...app,
    link: app.link, // Rename "url" to "link"
    url: undefined, // Remove "url"
    reference: app.refNo,
    refNo: undefined,
    title: app.proposal,
    proposal: undefined,
  }));

  const fileContent = `
  export const PlanningApps = ${JSON.stringify(modifiedApplications, null, 2)};
  `;

  // Correct the path to the frontend folder
  const frontendPath = path.join(__dirname, "../../frontend/src/");

  // Ensure the components directory exists
  await fs.promises.mkdir(frontendPath, { recursive: true });

  // Save the NewData.jsx file in the correct location
  const filePath = path.join(frontendPath, "NewData.jsx");
  await fs.promises.writeFile(filePath, fileContent, "utf8");

  console.log(
    "NewData.jsx has been created with the latest application data as an array!"
  );
}
