const Product = require('./models/Product');
const User = require('./models/User');
const Order = require('./models/Order');
const db = require('./db');

User.hasMany(Order);
Order.belongsTo(User);

Product.belongsToMany(Order, {through: 'orderProduct'});
Order.belongsToMany(Product, {through: 'orderProduct'});

module.exports={db, Product, User, Order};
