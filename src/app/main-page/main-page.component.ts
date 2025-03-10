import {
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
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
export class MainPageComponent implements OnInit, OnDestroy {
  private title = inject(Title);
  private meta = inject(Meta);
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private destroyRef = inject(DestroyRef);

  userIsAuthenticated: boolean = false;
  cartItemCount: number = 0;
  private authListenerSub!: Subscription;

  ngOnInit(): void {
    this.title.setTitle('MEAN Shop - The Best Online Store');

    this.meta.updateTag({
      name: 'description',
      content: 'The best store for products at great prices. Shop now!',
    });
    this.meta.updateTag({
      name: 'keywords',
      content: 'shop, products, online store, MEAN',
    });

    this.meta.updateTag({
      property: 'og:title',
      content: 'MEAN Shop - Online Store',
    });
    this.meta.updateTag({
      property: 'og:description',
      content:
        'A wide selection of products at excellent prices. Fast delivery!',
    });
    this.meta.updateTag({
      property: 'og:image',
      content: 'https://example.com/assets/shop-banner.jpg',
    });
    this.meta.updateTag({
      property: 'og:url',
      content: 'https://example.com/',
    });

    this.meta.updateTag({
      name: 'twitter:card',
      content: 'summary_large_image',
    });
    this.meta.updateTag({ name: 'twitter:title', content: 'MEAN Shop' });
    this.meta.updateTag({
      name: 'twitter:description',
      content: 'Shop the best products with fast delivery.',
    });
    this.meta.updateTag({
      name: 'twitter:image',
      content: 'https://example.com/assets/shop-banner.jpg',
    });

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
