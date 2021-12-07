const User = require('../models/User');
const {db} = require('../db');

describe('the functionality of the User model', () => {
  test('User instance properties', async () => {
    const testUser = await User.findByPk(1);
    expect(testUser.type).toBe('Standard');
    expect(testUser.name).toBe('User');
    expect(testUser.address).toBe('123 Somewhere St.');
    expect(testUser.phone).toBe(1234567890);
    expect(typeof testUser.phone).toBe('number');
  });

  test('findByEmail method functionality', async ()=>{
    const testUserByEmail = await User.findByEmail('user@email.com');
    expect(testUserByEmail.type).toBe('Standard');
    expect(testUserByEmail.name).toBe('User');
    expect(testUserByEmail.address).toBe('123 Somewhere St.');
  });
});
