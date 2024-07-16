import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Product } from '../../interfaces/product.interface';
import { ProductService } from '../../shared/product.service';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

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
export class ProductListComponent {
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
  productsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10, 20];
  private productSub: Subscription = new Subscription();
  constructor(private productService: ProductService) {}
  ngOnInit(): void {
    this.isLoading = true;
    this.productService
      .getProductUpdateListener()
      .subscribe(
        (productData: { products: Product[]; productCount: number }) => {
          this.products = productData.products;
          this.totalProducts = productData.productCount;
          this.isLoading = false;
        }
      );
    this.productService.getProducts(this.productsPerPage, this.currentPage);
  }

  delete(productId: string) {
    this.isLoading = true;
    this.productService.deleteProduct(productId).subscribe(() => {
      this.productService.getProducts(this.productsPerPage, this.currentPage);
    });
  }

  ngOnDestroy(): void {
    this.productSub.unsubscribe();
  }

  onChangePage(pageData: PageEvent): any {
    this.currentPage = pageData.pageIndex + 1;
    this.productsPerPage = pageData.pageSize;
    this.productService.getProducts(this.productsPerPage, this.currentPage);
  }
}
