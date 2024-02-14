const { matchItem } = require('./matchItem')
const { calcGrid } = require('./calcGrid.js')

function vend(rustplus, mapInfo, rustServerInfo) {
  let finalVendObject = []
  const mapMarkers = mapInfo.markers
  const vendingInfo = mapMarkers.filter((marker) =>
    marker.hasOwnProperty('sellOrders')
  )

  for (let i = 0; i < vendingInfo.length; i++) {
    let singleVending = vendingInfo[i].sellOrders
    let vendgingLocation = { x: vendingInfo[i].x, y: vendingInfo[i].y }

    for (let j = 0; j < singleVending.length; j++) {
      let sellOrder = singleVending[j]
      if (sellOrder.amountInStock != 0) {
        const shortNames = matchItem(sellOrder)
        const grid = calcGrid(
          rustServerInfo,
          vendingInfo[i].x,
          vendingInfo[i].y
        )

        const vendObj = {
          ...sellOrder,
          ...vendgingLocation,
          ...shortNames,
          ...grid,
        }
        finalVendObject.push(vendObj)
      }
    }
  }

  return finalVendObject
}

module.exports = { vend }
