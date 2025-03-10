import fs from 'fs'

console.log('setting lat long)')

const URL_POSTCODE_LOOKUP = `https://api.postcodes.io/postcodes/`

const newApplications = JSON.parse(
  await fs.promises.readFile(
    new URL('../data/applications.json', import.meta.url)
  )
)

const newApplicationsWithLatLon = await Promise.all(
  newApplications
    .filter(app => app.postcode && !app.latlon)
    .map(app => {
      return fetch(`${URL_POSTCODE_LOOKUP}${app.postcode}`)
        .then(r => r.json())
        .then(data => {
          if (data.status !== 200) {
            console.log(`Postcode lookup failed for ${app.refNo}`, data)
            return app
          }
          return {
            ...app,
            latitude: data.result.latitude.toString(),
            longitude: data.result.longitude.toString(),
          }
        })
    })
)


try {
  fs.writeFileSync('./data/applications.json', JSON.stringify(newApplicationsWithLatLon, null, 2))
} catch (err) {
  console.error(err)
}