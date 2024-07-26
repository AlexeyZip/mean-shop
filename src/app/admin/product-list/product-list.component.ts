import { Component, OnInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductService } from '../../shared/product.service';
import { Product } from '../../interfaces/product.interface';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule,
    MatTableModule,
    RouterModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
  ],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  isLoading: boolean = false;
  displayedColumns: string[] = [
    'title',
    'description',
    'price',
    'image',
    'actions',
  ];
  totalProducts = 0;
  productsPerPage = 20;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10, 20];
  userIsAuthenticated = false;
  userId: string | null = null;

  constructor(
    private productService: ProductService,
    private destroyRef: DestroyRef,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    console.log('Component initialized. Fetching products.');
    this.productService
      .getProductUpdateListener()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        (productData: { products: Product[]; productCount: number }) => {
          this.products = productData.products;
          this.totalProducts = productData.productCount;
          this.isLoading = false;
        }
      );
    this.authService
      .getAuthStatusListener()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
    this.productService.setPaginationParams(
      this.productsPerPage,
      this.currentPage
    );
    this.productService.getProducts();
  }

  delete(productId: string) {
    this.isLoading = true;
    this.productService
      .deleteProduct(productId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(
        () => {
          console.log('Product deleted:', productId);
          this.productService.getProducts();
        },
        () => {
          this.isLoading = false;
        }
      );
  }

  onChangePage(pageData: PageEvent): void {
    this.currentPage = pageData.pageIndex + 1;
    this.productsPerPage = pageData.pageSize;
    this.productService.setPaginationParams(
      this.productsPerPage,
      this.currentPage
    );
    this.productService.getProducts();
  }
}
