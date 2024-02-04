const Long = require('long')
const fs = require('fs')
const colors = require('colors/safe')

const express = require('express')

const RustPlus = require('@liamcottle/rustplus.js')
const { translate } = require('google-translate-api-browser')

const { Client, Events, GatewayIntentBits } = require('discord.js')
const { token } = require('./connection-files/config.json')
const client = new Client({ intents: [GatewayIntentBits.Guilds] })

const config = require('./connection-files/rustplus.config.json')
const serverAnswer = require('./connection-files/server-answer.json')

const app = express()
const PORT = process.env.PORT || 5002

app.get('/', (req, res) => res.send('api running'))
app.listen(PORT, () =>
  console.log(colors.brightGreen(`server started on port ${PORT}`))
)

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`)
})

// Log in to Discord with your client's token
client.login(token)

const { chatHandler } = require('./modules/chatHandler')
const { vend } = require('./modules/vend')
const { getMap } = require('./modules/getMap')
const { getTeamInfo } = require('./modules/getTeamInfo')
const { getRustServerInfo } = require('./modules/getRustServerInfo')
const { getRustServerTime } = require('./modules/getRustServerTime')

let rustServerInfo
let rustServerTime
let mapInfo
let teamInfo

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

    rustServerInfo = JSON.parse(
      fs.readFileSync('./rust-json-info/rust-server-info.json')
    ).response

    rustServerTime = JSON.parse(
      fs.readFileSync('./rust-json-info/rust-server-time.json')
    ).response

    teamInfo = JSON.parse(fs.readFileSync('./rust-json-info/team-info.json'))
      .response.teamInfo

    mapInfo = JSON.parse(fs.readFileSync('./rust-json-info/map-info.json'))
      .response.mapMarkers

    console.log(colors.brightBlue('server running'))
  }, 3000)
})

mapInfo = JSON.parse(fs.readFileSync('./rust-json-info/map-info.json')).response
  .mapMarkers

rustplus.on('message', (msg) => {
  if (msg.hasOwnProperty('broadcast')) {
    if (msg.broadcast.hasOwnProperty('teamMessage')) {
      chatHandler(rustplus, msg, rustServerInfo, rustServerTime, mapInfo)
    }
  }
})

rustplus.on('error', (err) => {
  console.log(err)
})

rustplus.connect()
