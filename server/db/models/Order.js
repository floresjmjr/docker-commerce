/* eslint-disable require-jsdoc */
const {db, DataTypes, Model}= require('../db');

class Order extends Model {
  // add methods here
}

Order.init({
  isPurchased: {type: DataTypes.INTEGER, defaultValue: 0},
}, {
  sequelize: db,
});
module.exports = Order;
