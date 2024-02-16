const Long = require('long')
const fs = require('fs')

// Import external modules
const colors = require('colors/safe')
const { translate } = require('google-translate-api-browser')

const express = require('express')

// Import modules
const { chatHandler } = require('./modules/chatHandler')
const { vend } = require('./modules/vend')
const { getMap } = require('./modules/getMap')
const { getTeamInfo } = require('./modules/getTeamInfo')
const { getRustServerInfo } = require('./modules/getRustServerInfo')
const { getRustServerTime } = require('./modules/getRustServerTime')

// Initialize rustplusjs and discordjs
const config = require('./connection-files/rustplus.config.json')
const serverAnswer = require('./connection-files/server-answer.json')

const RustPlus = require('@liamcottle/rustplus.js')
const rustplus = new RustPlus(
  serverAnswer.ip,
  serverAnswer.port,
  serverAnswer.playerId,
  serverAnswer.playerToken
)

const { token } = require('./connection-files/config.json')

const { Client, GatewayIntentBits } = require('discord.js')
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
})

// Initialize express
const app = express()
const PORT = process.env.PORT || 5002

//  Set default route
app.get('/', (req, res) => res.send('api running'))
app.listen(PORT, () =>
  console.log(colors.brightGreen(`server started on port ${PORT}`))
)

// Discord bot connection
client.once('ready', () => {
  console.log(`Ready! Logged in as ${client.user.tag}`)

  const channelId = '1204125775515746324'
  const channel = client.channels.cache.get(channelId)

  if (channel) {
    channel.send('Server running')
  } else {
    console.error(`Channel with ID ${channelId} not found.`)
  }
})

client.login(token)

// Initialize rustplus global variables
let rustServerInfo
let rustServerTime
let mapInfo
let teamInfo

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

    mapInfo = JSON.parse(fs.readFileSync('./rust-json-info/map-info.json'))
      .response.mapMarkers

    teamInfo = JSON.parse(fs.readFileSync('./rust-json-info/team-info.json'))
      .response.teamInfo

    console.log(colors.brightBlue('server running'))
  }, 3000)

  // rustplus.getEntityInfo(1782934631, (message) => {
  //   console.log('getEntityInfo response message: ' + JSON.stringify(message))
  //   return true
  // })

  // rustplus.getEntityInfo(1634088408, (message) => {
  // console.log('getEntityInfo response message: ' + JSON.stringify(message))
  // console.log(message.response.entityInfo.payload)
  //   return true
  // })
})

rustplus.on('message', (msg) => {
  if (msg.hasOwnProperty('broadcast')) {
    if (msg.broadcast.hasOwnProperty('teamMessage')) {
      chatHandler(
        rustplus,
        msg,
        rustServerInfo,
        rustServerTime,
        mapInfo,
        client
      )
    }
  }
})

// rustplus.on('message', (message) => {
//   if (message.broadcast && message.broadcast.entityChanged) {
//     var entityChanged = message.broadcast.entityChanged

//     var entityId = entityChanged.entityId
//     var value = entityChanged.payload.value

//     console.log(
//       'entity ' +
//         colors.blue(entityId) +
//         ' is now ' +
//         (value ? colors.green('active') : colors.red('inactive'))
//     )
//   }
// })

rustplus.on('error', (err) => {
  console.log(err)
})

rustplus.connect()
