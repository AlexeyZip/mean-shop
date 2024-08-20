import { Component, OnInit } from '@angular/core';
import { OrderService } from '../shared/order/order.service';
import { Product } from '../shared/product/product.model';
import { Order } from '../shared/order/order.model';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { CartService } from '../shared/cart/cart.service';
import { AuthService } from '../auth/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AngularMaterialModule } from '../angular-material.module';

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
    ReactiveFormsModule,
    AngularMaterialModule,
    MatProgressSpinnerModule,
  ],
})
export class CartComponent implements OnInit {
  createOrderForm: FormGroup;
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
    private cartService: CartService,
    private authService: AuthService
  ) {
    this.createOrderForm = new FormGroup({
      address: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      city: new FormControl(null, {
        validators: [Validators.required],
      }),
      postalCode: new FormControl(null, {
        validators: [Validators.required],
      }),
      country: new FormControl(null as File | null, {
        validators: [Validators.required],
      }),
    });
  }

  ngOnInit(): void {
    console.log('cart');

    this.loadCart();
  }

  loadCart(): void {
    this.cart = this.cartService.cart;
  }

  updateCart(): void {
    this.cartService.cart = this.cart.slice();
  }

  removeFromCart(productId: string | null): void {
    this.cart = this.cart.filter((item) => item.product.id !== productId);
    this.cartService.cart = this.cart.slice();
  }

  onPlaceOrder(): void {
    const orderProducts = this.cart.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    }));

    const deliveryInfo = {
      address: this.createOrderForm.get('address')?.value,
      city: this.createOrderForm.get('city')?.value,
      postalCode: this.createOrderForm.get('postalCode')?.value,
      country: this.createOrderForm.get('country')?.value,
    };

    const newOrder: Order = {
      id: null,
      products: orderProducts,
      user: this.authService.getUserId()!,
      totalPrice: this.calculateTotalPrice(),
      status: 'Pending',
      createdAt: new Date(),
      deliveryInfo,
    };

    this.orderService.createOrder(newOrder).subscribe((createdOrder) => {
      this.cartService.clearCart();
      this.cart = this.cartService.getCartItems();
    });
  }

  calculateTotalPrice(): number {
    return this.cart.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }

  onSaveOrder() {}
}
