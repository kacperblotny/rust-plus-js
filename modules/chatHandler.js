const colors = require('colors/safe')
const { translate } = require('google-translate-api-browser')
const { vend } = require('./vend.js')

const { calcGrid } = require('./calcGrid.js')

function chatHandler(rustplus, msg, rustServerInfo, rustServerTime, mapInfo) {
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

    rustplus.sendTeamMessage('Time: ' + formattedTime)
  }

  if (message.includes('.pop')) {
    rustplus.sendTeamMessage(
      'Players: ' +
        rustServerInfo.info.players +
        '/' +
        rustServerInfo.info.maxPlayers +
        ' Queue: ' +
        rustServerInfo.info.queuedPlayers
    )
  }

  if (message.includes('.gt')) {
    if (message.includes(':')) {
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
  }

  if (message.includes('.leader')) {
    let members = teamInfo.members
    const member = members.find((member) => member.name === author)
    const steamId = member.steamId

    rustplus.sendRequestAsync({
      promoteToLeader: {
        steamId: steamId,
      },
    })

    rustplus.sendTeamMessage('Leader given to ' + member.name + ' ' + steamId)
  }

  if (message.includes('.vendb')) {
    const messaggeSplit = message.split(' ')
    messaggeSplit.shift()
    const result = messaggeSplit.join(' ')

    const finalVendObject = vend(rustplus, mapInfo)

    const filteredItems = finalVendObject.filter(
      (item) =>
        item.itemShortName.toLowerCase().includes(result.toLowerCase()) ||
        item.itemLongName.toLowerCase().includes(result.toLowerCase())
    )
    if (filteredItems.length > 0) {
      rustplus.sendTeamMessage(
        `:exclamation: :${filteredItems[0].itemShortName}:  ${filteredItems.length} offers found for :${filteredItems[0].itemShortName}: :exclamation:`
      )

      const maxLimit = Math.min(filteredItems.length, 10)
      let counter = 0

      filteredItems.forEach((vending) => {
        if (vending.amountInStock != 0 && counter < maxLimit) {
          const grid = calcGrid(rustServerInfo, vending.x, vending.y)

          rustplus.sendTeamMessage(
            `(${vending.amountInStock} in stock) ${vending.quantity} :${vending.itemShortName}: for ${vending.costPerItem}:${vending.currencyShortName}: at ${grid}`
          )
          counter += 1
        }
      })
    } else {
      rustplus.sendTeamMessage('Miss spelled or no offers')
    }
  }

  if (message.includes('.vends')) {
    const messaggeSplit = message.split(' ')
    messaggeSplit.shift()
    const result = messaggeSplit.join(' ')

    const finalVendObject = vend(rustplus, mapInfo)

    const filteredItems = finalVendObject.filter(
      (item) =>
        item.currencyShortName.toLowerCase().includes(result.toLowerCase()) ||
        item.currencyLongName.toLowerCase().includes(result.toLowerCase())
    )
    if (filteredItems.length > 0) {
      rustplus.sendTeamMessage(
        `:exclamation: :${filteredItems[0].currencyShortName}:  ${filteredItems.length} offers found for :${filteredItems[0].currencyShortName}: :exclamation:`
      )

      const maxLimit = Math.min(filteredItems.length, 10)
      let counter = 0

      filteredItems.forEach((vending) => {
        if (vending.amountInStock != 0 && counter < maxLimit) {
          rustplus.sendTeamMessage(
            `(${vending.amountInStock} in stock) ${vending.quantity} :${vending.itemShortName}: for ${vending.costPerItem}:${vending.currencyShortName}:`
          )
          counter += 1
        }
      })
    } else {
      rustplus.sendTeamMessage('Miss spelled or no offers')
    }
  }
}

module.exports = { chatHandler }
