const fs = require('fs')
const colors = require('colors/safe')

function getTeamInfo(rustplus) {
  rustplus.getTeamInfo((info) => {
    fs.writeFile(
      './rust-json-info/team-info.json',
      JSON.stringify(info, null, 2),
      (err) => {
        if (err) {
          console.error(colors.red('Error saving team info:'), err)
        } else {
          //   members = info.response.teamInfo.members
          console.log(
            colors.brightBlue('team info has been saved to team-info.json')
          )
        }
      }
    )
  })
}

module.exports = { getTeamInfo }
