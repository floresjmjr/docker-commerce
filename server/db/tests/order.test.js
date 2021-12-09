const Order = require('../models/Order');


describe('the functionality of the Order model', () => {
  test('User instance properties', async () => {
    const testOrder = await Order.findByPk(1);
    expect(testOrder.isPurchased).toBe(1);
  });
});
