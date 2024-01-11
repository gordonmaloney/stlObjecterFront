import fs from 'fs'
import { google } from 'googleapis'
import { spreadsheetId, getCredentials } from './helpers/google.mjs'

const scopes = [
  'https://www.googleapis.com/auth/spreadsheets',
]
const auth = getCredentials(scopes)
const sheets = google.sheets({
  version: 'v4',
  auth: auth
})

const sheet = await sheets.spreadsheets.values.get({
  spreadsheetId,
  range: `A2:Z9999`
})

if (!sheet.data.values?.length) {
  throw new Error('The Google Sheet does not contain any applications!')
}

const applications = sheet.data.values
  .map(([
    refNo,
    url,
    status,
    received,
    validated,
    address,
    postcode,
    latlon,
    proposal,
  ]) => {
    const [lat, lon] = latlon.split(',')
    return {
      refNo,
      url,
      status,
      received,
      validated,
      address,
      postcode,
      lat,
      lon,
      proposal,
    }
  })

try {
  fs.writeFileSync('./public/applications.json', JSON.stringify(applications))
} catch (err) {
  console.error(err)
}