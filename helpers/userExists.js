function userExists(userInfo, array ) {
  
  for(const element of array) {
    if (element.name === userInfo.name) return true;
  }
  return false
}

module.exports = userExists