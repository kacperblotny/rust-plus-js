const { getSpacebars } = require('./getSpacebars.js')
const { getSpacebarsText } = require('./getSpacebarsText.js')

function discord(client, filteredItems) {
  console.log(`Sending discord message as ${client.user.tag}`)

  const channelId = '1204125775515746324'
  const channel = client.channels.cache.get(channelId)
  const ticks = '```'

  let counter = 0

  let msg = ''
  console.log(filteredItems)
  filteredItems.forEach((vending) => {
    if (counter <= 10) {
      msg += `(${
        vending.amountInStock +
        getSpacebars(vending.amountInStock.toString().length + 1)
      } in stock) ${
        vending.quantity + getSpacebars(vending.quantity.toString().length)
      }${vending.itemLongName} ${getSpacebarsText(
        vending.itemLongName.length
      )} for ${
        vending.costPerItem +
        getSpacebars(vending.costPerItem.toString().length)
      }${vending.currencyLongName}${getSpacebarsText(
        vending.currencyLongName.length
      )} at ${vending.grid}\n`

      counter += 1
    } else {
      counter = 0

      if (channel) {
        channel.send(`${ticks}cpp\n${msg}\n${ticks}`)
      } else {
        console.error(`Channel with ID ${channelId} not found.`)
      }

      msg = ''
    }
  })
  if (channel) {
    channel.send(`${ticks}cpp\n${msg}\n${ticks}`)
  } else {
    console.error(`Channel with ID ${channelId} not found.`)
  }
}

module.exports = { discord }
