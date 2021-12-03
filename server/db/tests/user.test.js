const User = require('../models/User');
const {db} = require('../db');

describe('the functionality of the User model', () => {
  beforeAll(async () => {
    await db.sync({force: true});
  });
  test('creating an User instance', async () => {
    const robertoInstance = await User.create({
      name: 'Roberto Gonzales',
      address: '467 Old Theatre Rd. Carpentersville, IL 60110',
      password: 'Password',
      email: 'email@gmail.com',
      phone: 8113036914,
    });
    expect(robertoInstance.name).toBe('Roberto Gonzales');
  });
});
