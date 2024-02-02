const Long = require('long')
const fs = require('fs')

const express = require('express')
const RustPlus = require('@liamcottle/rustplus.js')
const { translate } = require('google-translate-api-browser')

const config = require('./rustplus.config.json')
const serverAnswer = require('./connection-files/server-answer.json')

const colors = require('colors/safe')

const app = express()
const PORT = process.env.PORT || 5002

app.get('/', (req, res) => res.send('api running'))
app.listen(PORT, () =>
  console.log(colors.brightGreen(`server started on port ${PORT}`))
)

const { chatHandler } = require('./modules/chatHandler')
const { getMap } = require('./modules/getMap')
const { getTeamInfo } = require('./modules/getTeamInfo')
const { getRustServerInfo } = require('./modules/getRustServerInfo')
const { getRustServerTime } = require('./modules/getRustServerTime')

let rustServerInfo = JSON.parse(
  fs.readFileSync('./rust-json-info/rust-server-info.json')
).response
let rustServerTime = JSON.parse(
  fs.readFileSync('./rust-json-info/rust-server-time.json')
).response
let mapInfo = JSON.parse(fs.readFileSync('./rust-json-info/map-info.json'))
  .response.mapMarkers
let teamInfo = JSON.parse(fs.readFileSync('./rust-json-info/team-info.json'))
  .response.teamInfo

let members = teamInfo.members

const rustplus = new RustPlus(
  serverAnswer.ip,
  serverAnswer.port,
  serverAnswer.playerId,
  serverAnswer.playerToken
)

rustplus.on('connected', () => {
  console.log(colors.brightGreen('connected to app'))

  setInterval(() => {
    getRustServerInfo(rustplus)
    getRustServerTime(rustplus)
    getMap(rustplus)
    getTeamInfo(rustplus)

    console.log(colors.brightBlue('server running'))
  }, 5000)
})

rustplus.on('message', (msg) => {
  if (msg.hasOwnProperty('broadcast')) {
    if (msg.broadcast.hasOwnProperty('teamMessage')) {
      let returnedMessage = chatHandler(
        rustplus,
        msg,
        rustServerInfo,
        rustServerTime,
        members
      )
      rustplus.sendTeamMessage(returnedMessage)
      // if (message.includes('.gt')) {
      //   const splitMessage = message.split(':')
      //   const result = splitMessage.slice(1).join(':').trim()

      //   translate(result, { to: 'pl' })
      //     .then((res) => {
      //       console.log(res.text)
      //       rustplus.sendTeamMessage(res.text)
      //     })
      //     .catch((err) => {
      //       console.error(err)
      //     })
      // }
      // if (message.includes('.leader')) {
      //   const splitMessage = message.split(':')
      //   const result = splitMessage.slice(1).join(':').trim()

      //   const member = members.find((member) => member.name === author)
      //   // msg.broadcast.teamMessage.message.steamId.toString()
      //   const steamId = Long.fromBits(
      //     member.steamId.low,
      //     member.steamId.high,
      //     member.steamId.unsigned
      //   ).toString()

      //   // rustplus.promoteToLeader(steamId)
      //   // rustplus.sendRequestAsync({
      //   //   promoteToLeader: {
      //   //     steamId: steamId,
      //   //   },
      //   // })
      //   console.log(steamId)

      //   console.log(result)
      //   return result
      // }
    }
  }
})

rustplus.on('error', (err) => {
  console.log(err)
})

rustplus.connect()
