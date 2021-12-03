/* eslint-disable require-jsdoc */
const {db, DataTypes, Model}= require('../db');

class Product extends Model {
  // add methods here
}

Product.init({
  title: DataTypes.STRING,
  price: DataTypes.INTEGER,
  description: DataTypes.STRING,
  category: DataTypes.STRING,
  image: DataTypes.STRING,

}, {
  sequelize: db,
  timestamps: false,
});
module.exports = Product;
