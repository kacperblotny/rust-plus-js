function calcGrid(rustServerInfo, x, y) {
  let gridLabel
  const grids = rustServerInfo.info.mapSize / 146.28571428571428 - 1
  const cellSize = 146.28571428571428

  const gridX = Math.floor(x / cellSize)
  const gridY = Math.floor(y / cellSize)

  if (x > 3803) {
    gridLabel =
      'A' +
      String.fromCharCode('A'.charCodeAt(0) + (gridX % 26)) +
      Math.floor(grids - gridY)
  } else {
    gridLabel =
      String.fromCharCode('A'.charCodeAt(0) + gridX) + Math.floor(grids - gridY)
  }

  const gird = {
    grid: gridLabel,
  }

  return gird
}

module.exports = { calcGrid }
