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
  // order items from low to high price
  static async priceLowToHigh() {
    const products = Product.findAll({
      order: [
        'price', 'ASC',
      ],
    });
    return products;
  }
  // order items from high to low price
  static async priceHighToLow() {
    const products = Product.findAll({
      order: [
        'price', 'DESC',
      ],
    });
    return products;
  }
  // find items by search bar (might be case sensitive)
  static async searchByPhrase(query) {
    const searchResults = await Product.findAll({
      where: {
        [Op.or]: [
          {
            title: {
              [Op.substring]: `%${query}%`,
            },
          },
          {
            description: {
              [Op.substring]: `%${query}%`,
            },
          },
        ],
      },
    });
    return searchResults;
  }
}

Product.init({
  title: DataTypes.STRING,
  price: DataTypes.REAL,
  description: DataTypes.STRING,
  category: DataTypes.STRING,
  image: DataTypes.STRING,

}, {
  sequelize: db,
  timestamps: false,
});
module.exports = Product;
