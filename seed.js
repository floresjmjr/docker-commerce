const {db} = require('./server/db/db');
const fs = require('fs').promises;
const path = require('path');
const {Product, User, Order}= require('./server/db/index');

// dont have User or order info to seed

const seedProduct = async ()=>{
  // find the path to our json file
  const seedPath = path.join(__dirname, 'products.json');

  const buffer = await fs.readFile(seedPath);
  const products = JSON.parse(String(buffer));

  // will create each row for our Product Table
  const productPromises = products.map((product) => Product.create(product));

  await Promise.all(productPromises);
  console.log('product data has been successfully populated into our table');
};


const seedUser = async ()=>{
  // find the path to our json file
  const seedPath = path.join(__dirname, 'users.json');

  const buffer = await fs.readFile(seedPath);
  const users = JSON.parse(String(buffer));

  // will create each row for our Product Table
  const userPromises = users.map((user) => User.create(user));

  await Promise.all(userPromises);
  console.log('User data has been successfully populated into our table');
};

const seed = async () => {
  console.log("seeding Database...");
  await db.sync({force: true});
  console.log("DB cleared");
  await seedProduct();
  await seedUser();
  console.log("DB successfully seeded");
}

// export the seed function
  // Why?

seed();
