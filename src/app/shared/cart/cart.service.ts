import { Injectable } from '@angular/core';
import { Product } from '../product/product.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: { product: Product; quantity: number }[] = [];
  private cartItemCount = new BehaviorSubject<number>(0);
  cartItemCount$ = this.cartItemCount.asObservable();

  constructor() {}

  addToCart(product: Product): void {
    const existingItem = this.cart.find(
      (item) => item.product.id === product.id
    );
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this.cart.push({ product, quantity: 1 });
    }
    this.saveCart();
    this.updateCartItemCount();
  }

  getCartItems(): { product: Product; quantity: number }[] {
    return this.cart;
  }

  private saveCart(): void {
    console.log(this.cart);

    if (this.isLocalStorageAvailable()) {
      localStorage.setItem('cart', JSON.stringify(this.cart));
    }
  }

  updateCart(): void {
    this.saveCart();
    this.updateCartItemCount();
  }

  loadCart(): void {
    if (this.isLocalStorageAvailable()) {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        this.cart = JSON.parse(storedCart);
      }
      this.updateCartItemCount();
    }
  }

  clearCart(): void {
    this.cart = [];
    this.saveCart();
    this.updateCartItemCount();
  }

  private isLocalStorageAvailable(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }

  private updateCartItemCount(): void {
    const count = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    this.cartItemCount.next(count);
  }
}
