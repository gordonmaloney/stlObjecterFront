import fs from "fs";
import path from "path"; // Use path to correctly handle file paths
import { fileURLToPath } from "url"; // Needed to create __dirname equivalent

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
