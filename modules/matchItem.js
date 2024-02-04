const dataRustItems = require('../data/rust-items.json')

function matchItem(sellOrder, vendgingLocation) {
  const itemShort = dataRustItems.find(
    (matchItem) => matchItem['data-itemId'] === sellOrder.itemId
  )
  const itemLong = dataRustItems.find(
    (matchItem) => matchItem['data-itemId'] === sellOrder.itemId
  )
  const currency = dataRustItems.find(
    (matchItem) => matchItem['data-itemId'] === sellOrder.currencyId
  )

  const shortNames = {
    itemShortName: itemShort['data-shortname'],
    itemLongName: itemLong['data-name'],
    currencyShortName: currency['data-shortname'],
    currencyLongName: currency['data-name'],
  }
  return shortNames
}

module.exports = { matchItem }
