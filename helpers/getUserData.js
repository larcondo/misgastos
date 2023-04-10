function getUserData(userInfo, array) {
  for(const element of array) {
    if (element.name === userInfo.name) return element
  }
  return
}

module.exports = getUserData