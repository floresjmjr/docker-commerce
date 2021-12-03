/* eslint-disable require-jsdoc */
const {db, DataTypes, Model}= require('../db');

class Order extends Model {
  // add methods here
}

Order.init({
// since assocaition are set up the user id will appear on this page
// for strech goal could add things here

}, {
  sequelize: db,
  timestamps: false,
});
module.exports = Order;
