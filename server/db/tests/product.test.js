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
    expect(testProduct.category).toBe('Men\'s Clothing');
    expect(testProduct.image).toBe('https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg');
  });
  test('findByCategory Method functionality', async ()=>{
    const testProductElectonics = await Product.findByCategory('electronics');
    testProductElectonics.forEach((elem) =>
      expect(elem.category).toBe('Electronics'));
  });
  test('findByPrice Method functionality', async ()=>{
    const testAffordableProducts = await Product.findByPrice(20);
    testAffordableProducts.forEach((elem) =>
      expect(elem.price).toBeLessThanOrEqual(20));
  });
  test('priceHighToLow method functionality', async ()=>{
    const highFirst = Product.priceHighToLow();

    for (let i = 0; i< highFirst.length -1; i++) {
      expect(highFirst[i].price).toBeGreaterThanOrEqual(highFirst[i +1].price);
    }
  });
  test('priceLowToHigh method functionality', async ()=>{
    const lowFirst = Product.priceLowToHigh();
    for (let i = 0; i< lowFirst.length -1; i++) {
      expect(lowFirst[i].price).toBeLessThanOrEqual(lowFirst[i +1].price);
    }
  });
});
