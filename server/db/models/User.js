/* eslint-disable require-jsdoc */
const {db, DataTypes, Model}= require('../db');

class User extends Model {
  // add methods here
  static async findByEmail(email) {
    const user= await User.findOne({where: {email: email}});
    return user;
  }
}

User.init({
  type: DataTypes.STRING, // "Standard", "Admin"
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
