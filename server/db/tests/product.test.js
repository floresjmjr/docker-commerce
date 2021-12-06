const Product = require('../models/Product');
// const {db} = require('../db');
describe('the functionality of the Product model', () => {
  test('creating an Product instance', async () => {
    const testProduct = await Product.findByPk(1);
    expect(testProduct.title)
        .toBe('Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops');
    expect(testProduct.price).toBe(109.95);
    expect(typeof testProduct.description).toBe('string');
    expect(typeof testProduct.price).toBe('number');
    expect(testProduct.category).toBe('men\'s clothing');
    expect(testProduct.image).toBe('https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg');
  });
  test('findByCategory Method functionality', async ()=>{
    const testProductElectonics = await Product.findByCategory('electronics');
    testProductElectonics.forEach((elem) =>
      expect(elem.category).toBe('electronics'));
  });
  test('findByPrice Method functionality', async ()=>{
    const testAffordableProducts = await Product.findByPrice(20);
    testAffordableProducts.forEach(elem =>
      expect(elem.price).toBeLessThanOrEqual(20))
  });
});
