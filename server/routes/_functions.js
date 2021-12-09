function isAdmin(user) {
  if (user) {
    return user.type === 'Admin';
  }
  return false;
}

function select( value, options ){
  const selectElements = ["Men's Clothing", "Women's Clothing", "Jewelery", "Electronics"  ]
  let htmlString = ''
  const selectOptions = selectElements.map((category)=>{
    if (value === category) {
      return `<option value="${category}" selected>${category}</option>`
    } else {
      return `<option value="${category}">${category}</option>`
    }
  }) 
  return selectOptions.join('\r\n')
}

function lowercaseWords(sentence) {}

function capitalizeSentences(description, delimiter) {
  return description.split(delimiter).map((sentence) => {
    return sentence[0].toUpperCase() + sentence.substring(1) + '.';
  });
}

function formatMensClothing(description) {
  const delimiter = '. ';
  return capitalizeSentences(description, delimiter);
}

// No consistent pattern
// function formatElectronics(description){
//   const delimiter = /(\d)/
//   return capitalizeSentences(description, delimiter)
// }

function formatJewelry(description) {
  const delimiter = '. ';
  return capitalizeSentences(description, delimiter);
}

function formatWomensClothing(description) {
  let splitDesc = description.split(', ');
  // const arrDesc = [];
  // for (idx in splitDesc) {
  //   if (splitDesc[idx + 1]) {
  //     if (splitDesc[idx + 1][0] === splitDesc[idx + 1][0].toUpperCase()) {
  //       arrDesc.push(splitDesc[idx] + splitDesc[idx + 1]);
  //     } else {
  //       arrDesc.push(splitDesc[idx]);
  //     }
  //   }
  // }
  // console.log('arrDesc', arrDesc)
  return splitDesc.map((sentence) => {
    return sentence[0].toUpperCase() + sentence.substring(1) + '.';
  });
}

//Needs to be refactored using switch
function formatDescription(description, category) {
  if (category === "Women's Clothing") {
    // return Array.of(description)
    return formatWomensClothing(description);
  } else if (category === 'Jewelery') {
    return formatJewelry(description);
  } else if (category === "Men's Clothing") {
    return formatMensClothing(description);
  } else if (category === 'Electronics') {
    return Array.of(description);
  }
}

function formatPrice(price) {
  return price.toFixed(2);
}

function formatAllProducts(products) {
  for (product of products) {
    product.price = formatPrice(product.price);
  }
  return products;
}

function formatSingleProduct(product) {
  //Title and Category were formated in the seed.js file
  product.price = formatPrice(product.price);
  product.description = formatDescription(product.description, product.category);
  return product;
}

module.exports = {isAdmin, formatSingleProduct, formatAllProducts, select};
