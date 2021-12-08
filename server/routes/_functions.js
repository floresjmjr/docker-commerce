function isAdmin(user) {
  if (user) {
    return user.type === 'Admin';
  }
  return false;
}

function formatDescription(description) {}



function formatProduct(product) {


  return product;
}

module.exports = {isAdmin, formatProduct};
