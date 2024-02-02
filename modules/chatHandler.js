const colors = require('colors/safe')
const { translate } = require('google-translate-api-browser')

function chatHandler(rustplus, msg, rustServerInfo, rustServerTime, members) {
  let message = msg.broadcast.teamMessage.message.message
  let author = msg.broadcast.teamMessage.message.name
  console.log(colors.magenta(author + ': ' + message))

  if (message.includes('.time')) {
    let decimalTime = JSON.stringify(rustServerTime.time.time)
    const hours = Math.floor(decimalTime)
    const minutes = Math.round((decimalTime % 1) * 60)
    const formattedTime = `${String(hours).padStart(2, '0')}:${String(
      minutes
    ).padStart(2, '0')}`

    return 'Time: ' + formattedTime
  }

  if (message.includes('.pop')) {
    return (
      'Players: ' +
      rustServerInfo.info.players +
      '/' +
      rustServerInfo.info.maxPlayers +
      ' Queue: ' +
      rustServerInfo.info.queuedPlayers
    )
  }

  if (message.includes('.gt')) {
    const splitMessage = message.split(':')
    const result = splitMessage.slice(1).join(':').trim()

    translate(result, { to: 'pl' })
      .then((res) => {
        console.log(res.text)
        rustplus.sendTeamMessage(res.text)
      })
      .catch((err) => {
        console.error(err)
      })
  }

  if (message.includes('.leader')) {
    const splitMessage = message.split(':')
    const result = splitMessage.slice(1).join(':').trim()

    const member = members.find((member) => member.name === author)
    //   msg.broadcast.teamMessage.message.steamId.toString()
    const steamId = member.steamId
    // const steamId = Long.fromBits(
    //   member.steamId.low,
    //   member.steamId.high,
    //   member.steamId.unsigned
    // ).toString()

    // rustplus.promoteToLeader(steamId)
    // rustplus.sendRequestAsync({
    //   promoteToLeader: {
    //     steamId: steamId,
    //   },
    // })

    let leaderSucces = 'Leader given to ' + member.name + ' ' + steamId

    return leaderSucces
  }

  if (message === '2137') {
    return 'Pope John Paul II was head of the Catholic Church and sovereign of the Vatican City State from 1978 until his death in 2005.'
  }
}

module.exports = { chatHandler }
