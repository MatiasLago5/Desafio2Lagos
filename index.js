const fs = require("fs");
const path = require("path");

class ProductManager {
  constructor(path) {
    this.path = path;
    this.products = [];
    this.autoIncrementId = 1;
    this.loadProducts();
  }

  loadProducts() {
    try {
      const fileContents = fs.readFileSync(this.path, "utf-8");
      this.products = JSON.parse(fileContents);
      const lastProduct = this.products[this.products.length - 1];
      this.autoIncrementId = lastProduct ? lastProduct.id + 1 : 1;
    } catch (error) {
      this.products = [];
      this.autoIncrementId = 1;
    }
  }

  saveProducts() {
    fs.writeFileSync(
      this.path,
      JSON.stringify(this.products, null, 2),
      "utf-8"
    );
  }

  isFieldValid(value) {
    return value !== undefined && value !== null && value !== '';
  }

  isCodeUnique(code) {
    return !this.products.some(product => product.code === code);
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    if (
      this.isFieldValid(title) &&
      this.isFieldValid(description) &&
      this.isFieldValid(price) &&
      this.isFieldValid(thumbnail) &&
      this.isFieldValid(code) &&
      this.isFieldValid(stock) &&
      this.isCodeUnique(code)
    ) {
      const product = {
        id: this.autoIncrementId++,
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      };

      this.products.push(product);
      this.saveProducts();
      return product;
    } else {
      throw new Error('Todos los campos son obligatorios y el código debe ser único.');
    }
  }

  getProductById(id) {
    return this.products.find((product) => product.id === id);
  }

  getProducts() {
    return this.products;
  }

  updateProduct(id, newData) {
    const productIndex = this.products.findIndex(
      (product) => product.id === id
    );
    if (productIndex !== -1) {
      this.products[productIndex] = {
        ...this.products[productIndex],
        ...newData,
      };
      this.saveProducts();
      return this.products[productIndex];
    }
    return null;
  }

  deleteProduct(id) {
    const productIndex = this.products.findIndex(
      (product) => product.id === id
    );
    if (productIndex !== -1) {
      const deletedProduct = this.products.splice(productIndex, 1)[0];
      this.saveProducts();
      return deletedProduct;
    }
    return null;
  }
}

const dataPath = path.join(__dirname, 'data', 'products.json');
const productManager = new ProductManager(dataPath);
productManager.addProduct('Producto prueba', 'Este es un producto prueba', 200, 'sin imagen', 'abc123', 25);
productManager.addProduct('Producto prueba 2', 'Este es un producto prueba 2', 100, 'sin imagen', 'cbd321', 50);

console.log(productManager.getProducts());
const product1 = productManager.getProductById(1);
console.log(product1);

const updatedProduct = productManager.updateProduct(2, { price: 250, stock: 30 });
console.log(updatedProduct);

const deletedProduct = productManager.deleteProduct(1);
console.log(deletedProduct);