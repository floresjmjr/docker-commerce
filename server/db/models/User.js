/* eslint-disable require-jsdoc */
const {db, DataTypes, Model}= require('../db');

class User extends Model {
  // add methods here
}

User.init({
  type: DataTypes.STRING,
  name: DataTypes.STRING,
  address: DataTypes.STRING,
  password: DataTypes.STRING,
  email: DataTypes.STRING,
  phone: DataTypes.INTEGER,

}, {
  sequelize: db,
  timestamps: false,
});
module.exports = User;
