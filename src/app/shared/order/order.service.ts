import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, Subject } from 'rxjs';
import { Order } from './order.model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private orders: Order[] = [];
  private ordersUrl = 'http://localhost:3000/api/orders';
  private ordersPerPage: number = 2;
  private currentPage: number = 1;
  private orderUpdated = new Subject<{
    orders: Order[];
    orderCount: number;
  }>();

  constructor(private http: HttpClient) {}

  getOrderUpdateListener() {
    return this.orderUpdated.asObservable();
  }

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(`${this.ordersUrl}/order`, order);
  }

  getOrders(): void {
    const queryParams = `?pagesize=${this.ordersPerPage}&page=${this.currentPage}`;
    this.http
      .get<{ message: string; orders: Order[]; maxOrders: number }>(
        `${this.ordersUrl}/orders` + queryParams
      )
      .pipe(
        map((orderData) => {
          console.log('Order data from server:', orderData);
          return {
            orders: orderData.orders.map((order: any) => {
              return {
                products: order.products,
                user: order.user,
                totalPrice: order.totalPrice,
                id: order._id,
                status: order.status,
                createdAt: order.createdAt,
                deliveryInfo: order.deliveryInfo,
              };
            }),
            maxOrders: orderData.maxOrders,
          };
        }),
        catchError((error) => {
          console.error('Error fetching orders:', error);
          throw error;
        })
      )
      .subscribe((transformedOrderData) => {
        console.log('Transformed products:', transformedOrderData);
        this.orders = transformedOrderData.orders;
        this.orderUpdated.next({
          orders: [...this.orders],
          orderCount: transformedOrderData.maxOrders,
        });
      });
  }

  getOrderById(id: string): Observable<Order> {
    return this.http.get<Order>(`${this.ordersUrl}/order/${id}`);
  }

  updateOrder(id: string, order: Order): Observable<any> {
    return this.http.put(`${this.ordersUrl}/order/${id}`, order);
  }

  deleteOrder(id: string): Observable<any> {
    return this.http.delete(`${this.ordersUrl}/order/${id}`);
  }

  setPaginationParams(productsPerPage: number, currentPage: number) {
    this.ordersPerPage = productsPerPage;
    this.currentPage = currentPage;
    console.log('Pagination params set:', this.ordersPerPage, this.currentPage);
  }
}
