import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  effect,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
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
export class MainPageComponent implements OnInit {
  userIsAuthenticated = signal(false);
  cartItemCount: number = 0;

  constructor(
    public router: Router,
    private authService: AuthService,
    private cartService: CartService,
    private destroyRef: DestroyRef,
    private cdr: ChangeDetectorRef
  ) {
    effect(() => {
      console.log('Signal changed:', this.userIsAuthenticated());
    });
  }

  ngOnInit(): void {
    console.log('MainPageComponent created');
    this.cartService.loadCart();
    // this.userIsAuthenticated =
    this.authService
      .getAuthStatusListener()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((isAuthenticated) => {
        console.log('isAuthenticated------->', isAuthenticated);
        // setTimeout(() => {
        this.userIsAuthenticated.set(isAuthenticated);
        // },)

        this.cdr.detectChanges();
      });
    this.updateCartItemCount();

    // this.authListenerSub = this.authService
    //   .getAuthStatusListener()
    //   .subscribe((isAuthenticated: boolean) => {
    //     this.userIsAuthenticated = isAuthenticated;
    //   });
    this.cartService.cartItemCount$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((count: any) => {
        this.cartItemCount = count;
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

  private updateCartItemCount(): void {
    const cartItems = this.cartService.getCartItems();
    this.cartItemCount = cartItems.reduce(
      (count, item) => count + item.quantity,
      0
    );
  }
}
