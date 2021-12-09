const {db, Product, User, Order} = require('../index');

describe('the association of the models', () => {
  test('creating an Product instance', async () => {
    const robertoInstance = await User.create({
      name: 'Roberto Gonzales',
      address: '467 Old Theatre Rd. Carpentersville, IL 60110',
      password: 'Password',
      email: 'email@gmail.com',
      phone: 8113036914,
    });
    const jacket = await Product.create({
      title: 'Mens Cotton Jacket',
      price: 55.99,
      description:
        'great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors. Good gift choice for you or your family member. A warm hearted love to Father, husband or son in this thanksgiving or Christmas Day.',
      category: 'men\'s clothing',
      image: 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg',
    });
    // expect().toBe();
  });
});
