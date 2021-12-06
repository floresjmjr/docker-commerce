/* eslint-disable require-jsdoc */
const {db, DataTypes, Model}= require('../db');
const {Op} = require('sequelize');

class Product extends Model {
  // add methods here
  // find items by their category
  static async findByCategory(category) {
    const items = await Product.findAll({
      where: {
        category: category}});
    return items;
  }
  // find items where price is less than or equal to input price
  static async findByPrice(price) {
    const affordableItems = await Product.findAll({
      where: {
        price: {
          [Op.lte]: price,
        }}});
    return affordableItems;
  }
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
