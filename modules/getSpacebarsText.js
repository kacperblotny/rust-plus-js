function getSpacebarsText(length) {
  let spacebars = ''
  let character = ' '

  if (length < 36) {
    for (let i = 0; i < 35 - length; i++) {
      spacebars += character
    }
  }

  //   if (length === 1) {
  //     spacebars = '   '
  //   }
  //   if (length === 2) {
  //     spacebars = '  '
  //   }
  //   if (length === 3) {
  //     spacebars = ' '
  //   }
  //   if (length === 4) {
  //     spacebars = ''
  //   }

  return spacebars
}

module.exports = { getSpacebarsText }
