const {db} = require('./server/db/db');
const fs = require('fs').promises;
const path = require('path');
const {Product, User, Order}= require('./server/db');


// dont have User or order info to seed

const seedProduct = async ()=>{
  // find the path to our json file
  const seedPath = path.join(__dirname, 'seeds/products.json');

  const buffer = await fs.readFile(seedPath);
  const products = JSON.parse(String(buffer));

  // formating product properties
  function capitalize(string) {
    let wordArr = string.trim().split(' ');
    formattedArr = wordArr.map((word) => {
      return word[0].toUpperCase() + word.substring(1).toLowerCase();
    });
    string = formattedArr.join(' ');
    return string;
  }

  // will create each row for our Product Table
  const productPromises = products.map((product) => 
  {
    product.category = capitalize(product.category)
    if(!(product.category === 'Electronics')){
      product.title = capitalize(product.title)
    }
    console.log('category')
    product.price = Number(product.price.toFixed(2))
    console.log(product)
    return Product.create(product)
  });

  await Promise.all(productPromises);
  console.log('product data has been successfully populated into our table');
};


const seedUser = async ()=>{
  // find the path to our json file
  const seedPath = path.join(__dirname, 'seeds/users.json');

  const buffer = await fs.readFile(seedPath);
  const users = JSON.parse(String(buffer));

  // will create each row for our User Table
  const userPromises = users.map((user) => User.create(user));

  await Promise.all(userPromises);
  console.log('User data has been successfully populated into our table');
};

// Creates order for each user
// At time of writing, User did not habe orders by default
const seedUserOrders = async () => {
  // find the path to our json file
  const seedPath = path.join(__dirname, 'seeds/order.json');

  const buffer = await fs.readFile(seedPath);
  const orders = JSON.parse(String(buffer));

  // will create each row for our Or Table
  const orderPromises = orders.map((order) => Order.create(order));

  await Promise.all(orderPromises);
  console.log('Order data has been successfully populated into our table');
};

// Fills carts with products
const seedCart = async () =>{
  // find the path to our json file
  const seedPath = path.join(__dirname, 'seeds/orderProduct.json');

  const buffer = await fs.readFile(seedPath);
  const orderProducts = JSON.parse(String(buffer));

  // will create each row for our Product Table
  const orderProductPromises = orderProducts.map(async (orderProduct) => {
    // get Order we are adding Item to
    const order = await Order.findByPk(orderProduct.OrderId);

    // get Product to add
    const product = await Product.findByPk(orderProduct.ProductId);

    // add association row
    await order.addProduct(product);
  });

  await Promise.all(orderProductPromises);
  console.log('Products have successfully been added to Orders');
};


const seed = async () => {
  console.log('seeding Database...');
  await db.sync({force: true});
  console.log('DB cleared');
  await seedProduct();
  await seedUser();
  await seedUserOrders();
  await seedCart();
  console.log('DB successfully seeded');
};

// export the seed function
// Why?


seed();


