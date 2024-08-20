import { Component, DestroyRef, OnInit } from '@angular/core';
import { Order } from '../../shared/order/order.model';
import { OrderService } from '../../shared/order/order.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { CreateProductComponent } from '../create-product/create-product.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { AuthService } from '../../auth/auth.service';
import { Product } from '../../interfaces/product.interface';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

@Component({
  standalone: true,
  selector: 'app-orders',
  templateUrl: './orders-page.component.html',
  styleUrls: ['./orders-page.component.scss'],
  imports: [
    CommonModule,
    CreateProductComponent,
    MatCardModule,
    MatButtonModule,
    RouterModule,
    MatPaginatorModule,
    MatTableModule,
    MatIconModule,
  ],
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];

  isLoading: boolean = false;
  displayedColumns: string[] = [
    'createdAt',
    'productsQuantity',
    'status',
    'totalPrice',
  ];
  totalOrders = 0;
  ordersPerPage = 20;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10, 20];
  userIsAuthenticated = false;
  userId: string | null = null;

  constructor(
    private orderService: OrderService,
    private destroyRef: DestroyRef,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    console.log('Component initialized. Fetching orders.');
    this.orderService
      .getOrderUpdateListener()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((orderData: { orders: Order[]; orderCount: number }) => {
        console.log(orderData);

        this.orders = orderData.orders;
        this.totalOrders = orderData.orderCount;
        this.isLoading = false;
      });
    this.authService
      .getAuthStatusListener()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
    this.orderService.setPaginationParams(this.ordersPerPage, this.currentPage);
    this.orderService.getOrders();
  }

  //   delete(productId: string) {
  //     this.isLoading = true;
  //     this.productService
  //       .deleteProduct(productId)
  //       .pipe(takeUntilDestroyed(this.destroyRef))
  //       .subscribe(
  //         () => {
  //           console.log('Product deleted:', productId);
  //           this.productService.getProducts();
  //         },
  //         () => {
  //           this.isLoading = false;
  //         }
  //       );
  //   }

  onChangePage(pageData: PageEvent): void {
    this.currentPage = pageData.pageIndex + 1;
    this.ordersPerPage = pageData.pageSize;
    this.orderService.setPaginationParams(this.ordersPerPage, this.currentPage);
    this.orderService.getOrders();
  }
}
