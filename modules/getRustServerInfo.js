const fs = require('fs')
const colors = require('colors/safe')

function getRustServerInfo(rustplus) {
  rustplus.getInfo((info) => {
    fs.writeFile(
      './rust-json-info/rust-server-info.json',
      JSON.stringify(info, null, 2),
      (err) => {
        if (err) {
          console.error(colors.red('Error saving rust server info:'), err)
        } else {
          console.log(
            colors.brightBlue('rust info saved to rust-server-info.json')
          )
        }
      }
    )
  })
}

module.exports = { getRustServerInfo }
