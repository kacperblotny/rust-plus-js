const fs = require('fs')
const colors = require('colors/safe')

function getMap(rustplus) {
  rustplus.getMapMarkers((map) => {
    fs.writeFile(
      './rust-json-info/map-info.json',
      JSON.stringify(map, null, 2),
      (err) => {
        if (err) {
          console.error(colors.red('Error saving map info:'), err)
        } else {
          console.log(colors.brightBlue('map saved to map-info.json'))
        }
      }
    )
  })
}

module.exports = { getMap }
