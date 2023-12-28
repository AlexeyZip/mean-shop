import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
  })
export class ProductService {
    constructor() {

    }

    private productsKey = 'products';

    // createProduct(product: any): any {
    //     this.products.push(product);
    //     console.log(this.products);
        
    // }

    // getProducts(): any {
    //     console.log(this.products);
    //     return this.products
    // }

    createProduct(product: any): void {
        const products = this.getProducts();
        products.push(product);
        localStorage.setItem(this.productsKey, JSON.stringify(products));
      }
    
    getProducts(): any {
    const productsString = localStorage.getItem(this.productsKey);
    return productsString ? JSON.parse(productsString) : [];
    }
    
    //   removeProduct(key: string): void {
    //     localStorage.removeItem(key);
    //   }
}