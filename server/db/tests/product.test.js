const Product = require('../models/Product');
const {db} = require('../db');

describe('the functionality of the Product model', () => {
  beforeAll(async () => {
    await db.sync({force: true});
  });
  test('creating an Product instance', async () => {
    const jacket = await Product.create({
      title: 'Mens Cotton Jacket',
      price: 55.99,
      description:
        'great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors. Good gift choice for you or your family member. A warm hearted love to Father, husband or son in this thanksgiving or Christmas Day.',
      category: 'men\'s clothing',
      image: 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg',
    });
    expect(jacket.title).toBe('Mens Cotton Jacket');
  });
});
