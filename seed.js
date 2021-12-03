const {db} = require('./server/db/db');
const fs = require('fs').promises;
const path = require('path');
const {Product, User, Order}= require('./server/db/index');

// dont have User or order info to seed

const seed = async ()=>{
  // clear out our table
  await db.sync({force: true});

  // find the path to our json file
  const seedPath = path.join(__dirname, 'products.json');

  const buffer = await fs.readFile(seedPath);
  const products = JSON.parse(String(buffer));

  // will create each row for our Product Table
  const productPromises = products.map((product) => Product.create(product));

  await Promise.all(productPromises);
  console.log('product data has been successfully populated into our table');
};

// export this seed function
seed();
