import { Injectable } from '@angular/core';
import { Product } from '../product/product.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private _cart: { product: Product; quantity: number }[] = [];
  private cartItemCount = new BehaviorSubject<number>(0);
  cartItemCount$ = this.cartItemCount.asObservable();

  constructor() {
    this.loadCart();
  }

  get cart(): { product: Product; quantity: number }[] {
    return [...this._cart];
  }

  set cart(items: { product: Product; quantity: number }[]) {
    this._cart = [...items];
    this.saveCart();
    this.updateCartItemCount();
  }

  addToCart(product: Product): void {
    const existingItem = this._cart.find(
      (item) => item.product.id === product.id
    );
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      this._cart.push({ product, quantity: 1 });
    }
    this.saveCart();
    this.updateCartItemCount();
  }

  getCartItems(): { product: Product; quantity: number }[] {
    return this._cart;
  }

  updateCart(): void {
    this.saveCart();
    this.updateCartItemCount();
  }

  private saveCart(): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.setItem('cart', JSON.stringify(this._cart));
    }
  }

  loadCart(): void {
    if (this.isLocalStorageAvailable()) {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        this._cart = JSON.parse(storedCart);
      }
      this.updateCartItemCount();
    }
  }

  clearCart(): void {
    this._cart = [];
    this.saveCart();
    this.updateCartItemCount();
  }

  private isLocalStorageAvailable(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }

  private updateCartItemCount(): void {
    const count = this._cart.reduce((sum, item) => sum + item.quantity, 0);
    this.cartItemCount.next(count);
  }
}
