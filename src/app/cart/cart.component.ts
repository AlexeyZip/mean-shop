import { Component, OnInit } from '@angular/core';
import { OrderService } from '../shared/order/order.service';
import { Product } from '../shared/product/product.model';
import { Order } from '../shared/order/order.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { CartService } from '../shared/cart/cart.service';

@Component({
  standalone: true,
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
  ],
})
export class CartComponent implements OnInit {
  cart: {
    product: {
      id: string | null;
      title: string;
      description: string;
      imagePath?: File | any;
      price: number;
      creator: string | null;
    };
    quantity: number;
  }[] = [];

  constructor(
    private orderService: OrderService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    console.log('cart');

    this.loadCart();
  }

  loadCart(): void {
    this.cart = this.cartService.getCartItems();
  }

  //   addToCart(product: Product): void {
  //     this.cartService.addToCart(product);
  //     this.cart = this.cartService.getCartItems();
  //   }

  updateCart(): void {
    this.cartService.updateCart();
    this.cart = this.cartService.getCartItems();
  }

  removeFromCart(productId: string | null): void {
    this.cart = this.cart.filter((item) => item.product.id !== productId);
    this.cartService.updateCart();
  }

  onPlaceOrder(): void {
    const orderProducts = this.cart.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    }));

    const newOrder: Order = {
      id: null,
      products: orderProducts,
      user: 'user-id',
      totalPrice: this.calculateTotalPrice(),
      status: 'Pending',
      createdAt: new Date(),
    };

    this.orderService.createOrder(newOrder).subscribe((createdOrder) => {
      this.cartService.clearCart();
      this.cart = this.cartService.getCartItems();
      console.log('Order placed successfully:', createdOrder);
    });
  }

  calculateTotalPrice(): number {
    return this.cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }
}
