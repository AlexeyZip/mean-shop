import { Component, DestroyRef, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLinkActive } from '@angular/router';
import { RouterModule, Routes } from '@angular/router';
import { MatBadgeModule } from '@angular/material/badge';
import { ProductNavigationComponent } from '../product-navigation/product-navigation.component';
import { AngularMaterialModule } from '../angular-material.module';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { CartService } from '../shared/cart/cart.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ProductNavigationComponent,
    AngularMaterialModule,
    MatBadgeModule,
  ],
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit, OnDestroy {
  userIsAuthenticated: boolean = false;
  cartItemCount: number = 0;
  private authListenerSub!: Subscription;

  constructor(
    public router: Router,
    private authService: AuthService,
    private cartService: CartService,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.cartService.loadCart();
    this.userIsAuthenticated = this.authService.getAuthStatus();
    this.updateCartItemCount();
    this.authListenerSub = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated: boolean) => {
        this.userIsAuthenticated = isAuthenticated;
      });
    this.cartService.cartItemCount$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((count: any) => {
        this.cartItemCount = count;
      });
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    if (this.authListenerSub) {
      this.authListenerSub.unsubscribe();
    }
  }

  private updateCartItemCount(): void {
    const cartItems = this.cartService.getCartItems();
    this.cartItemCount = cartItems.reduce(
      (count, item) => count + item.quantity,
      0
    );
  }
}
