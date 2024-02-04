const colors = require('colors/safe')
const { translate } = require('google-translate-api-browser')
const { vend } = require('./vend.js')

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
          rustplus.sendTeamMessage(
            `(${vending.amountInStock} in stock) ${vending.quantity} :${vending.itemShortName}: for ${vending.costPerItem}:${vending.currencyShortName}:`
          )
          counter += 1
        }
      })
    } else {
      rustplus.sendTeamMessage('Kurwa naucz się pisać')
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
      rustplus.sendTeamMessage('Kurwa naucz się pisać')
    }
  }

  if (message.includes('.fagata')) {
    rustplus.sendTeamMessage(
      'Ja jestem Fagata, sexy cipka spod Konia (Aha) Dupa taka duża, że jej szkoda nie wypinać (Aha)'
    )
    rustplus.sendTeamMessage(
      'Jak nie masz sześciu zer na koncie, nawet nie podbijaj (Aha) Dziś loty private jetem, kiedyś luksus to był Freenow (Aha)'
    )
    rustplus.sendTeamMessage(
      'Ej, dziś wakacje w LA, kiedyś było to moje marzenie (Aha) Wszędzie gdzie nie wejdę to robię wrażenie (Haha)'
    )
    rustplus.sendTeamMessage('Powiększyłam dupę jak zrobiłam karierę (Ups)')
    rustplus.sendTeamMessage('Bolą plecy mnie, no bo mam za duże obciążenie')
    rustplus.sendTeamMessage('Mój ex, dziwka, jebać typa (Kurwa)')
    rustplus.sendTeamMessage('Mógł pić Coca-Colę, a została Hoop – cytryna')
    rustplus.sendTeamMessage('Nie wrócę do byłego, może pomarzyć chyba')
    rustplus.sendTeamMessage('Nawet jego matka, go kiedyś zostawiła (Haha)')
  }

  if (message === '2137') {
    rustplus.sendTeamMessage(
      'Pope John Paul II was head of the Catholic Church and sovereign of the Vatican City State from 1978 until his death in 2005.'
    )
    rustplus.sendTeamMessage(
      'In his youth, Wojtyła dabbled in stage acting. He graduated with excellent grades from an all-boys high school in Wadowice,'
    )
    rustplus.sendTeamMessage(
      'Poland, in 1938, soon after which World War II broke out. During the war, to avoid being kidnapped and sent off to a German '
    )
    rustplus.sendTeamMessage(
      'slave labor camp, he signed up for work in harsh conditions in a quarry.Wojtyła eventually took up acting and developed a love for the profession and participated at a local theater.'
    )
    rustplus.sendTeamMessage(
      'for the profession and participated at a local theater. The linguistically skilled Wojtyła wanted to study Polish at university.'
    )
    rustplus.sendTeamMessage(
      'Encouraged by a conversation with Adam Stefan Sapieha, he decided to study theology and become a priest.'
    )
  }
}

module.exports = { chatHandler }
