function isAdmin(user){
  if(user){
    return user.type === 'Admin'
  }
  return false
}

module.exports = {isAdmin}