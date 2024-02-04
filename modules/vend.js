const { matchItem } = require('./matchItem')

function vend(rustplus, mapInfo) {
  let finalVendObject = []
  const mapMarkers = mapInfo.markers
  const vendingInfo = mapMarkers.filter((marker) =>
    marker.hasOwnProperty('sellOrders')
  )

  for (var i = 0; i < vendingInfo.length; i++) {
    var singleVending = vendingInfo[i].sellOrders
    var vendgingLocation = { x: vendingInfo[i].x, y: vendingInfo[i].y }

    for (var j = 0; j < singleVending.length; j++) {
      var sellOrder = singleVending[j]
      const shortNames = matchItem(sellOrder)

      const vendObj = {
        ...sellOrder,
        ...vendgingLocation,
        ...shortNames,
      }
      finalVendObject.push(vendObj)
    }
  }

  return finalVendObject
}

module.exports = { vend }
