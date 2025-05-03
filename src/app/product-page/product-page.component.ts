import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from '../shared/product/product.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CreateProductComponent } from '../admin/create-product/create-product.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CartService } from '../shared/cart/cart.service';
import { Product } from '../shared/product/product.model';

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [
    CommonModule,
    CreateProductComponent,
    MatCardModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.scss',
})
export class ProductPageComponent implements OnInit, OnDestroy {
  products: any[] = [];
  private productSub: Subscription = new Subscription();
  private routeSub: Subscription = new Subscription();
  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.productService
      .getProductUpdateListener()
      .subscribe(
        (productData: { products: Product[]; productCount: number }) => {
          this.products = productData.products;
        }
      );
    this.routeSub = this.route.params.subscribe((params) => {
      const category = params['category'] || 'all';
      this.productService.getProducts(category);
    });
  }

  onDelete(productId: string): void {
    this.productService.deleteProduct(productId);
  }

  ngOnDestroy(): void {
    this.productSub.unsubscribe();
  }

  addItemToCart(product: Product): void {
    this.cartService.addToCart(product);
  }
}
