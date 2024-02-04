const fs = require('fs')
const colors = require('colors/safe')

function getRustServerTime(rustplus) {
  rustplus.getTime((time) => {
    fs.writeFile(
      './rust-json-info/rust-server-time.json',
      JSON.stringify(time, null, 2),
      (err) => {
        if (err) {
          console.error(colors.red('Error saving rust server time info:'), err)
        } else {
          console.log(
            colors.brightBlue('rust time saved to rust-server-time.json')
          )
        }
      }
    )
  })
}

module.exports = { getRustServerTime }
