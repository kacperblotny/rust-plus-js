function getSpacebars(length) {
  let spacebars = ''

  if (length === 1) {
    spacebars = '   '
  }
  if (length === 2) {
    spacebars = '  '
  }
  if (length === 3) {
    spacebars = ' '
  }
  // if (length === 1) {
  //   spacebars = '   '
  // }
  // if (length === 2) {
  //   spacebars = '  '
  // }
  // if (length === 3) {
  //   spacebars = ' '
  // }
  if (length === 4) {
    spacebars = ''
  }

  return spacebars
}

module.exports = { getSpacebars }
