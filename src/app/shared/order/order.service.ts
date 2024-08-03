import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Order } from './order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private baseUrl = 'http://localhost:3000/api/orders'; // Замените на ваш реальный URL

  constructor(private http: HttpClient) {}

  // Создание нового заказа
  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(`${this.baseUrl}/order`, order);
  }

  // Получение всех заказов пользователя
  //   getOrders(): Observable<Order[]> {
  //     return this.http
  //       .get<{ message: string; orders: any }>(`${this.baseUrl}/orders`)
  //       .pipe(
  //         map((response) => {
  //           return response.orders.map((order: Order) => {
  //             return {
  //               ...order,
  //               products: order.products.map((p) => ({
  //                 ...p.product,
  //                 quantity: p.quantity,
  //               })),
  //             };
  //           });
  //         })
  //       );
  //   }

  //   // Получение заказа по ID
  //   getOrderById(orderId: string): Observable<Order> {
  //     return this.http.get<Order>(`${this.baseUrl}/order/${orderId}`);
  //   }

  //   // Обновление существующего заказа
  //   updateOrder(order: Order): Observable<Order> {
  //     return this.http.put<Order>(`${this.baseUrl}/order/${order.id}`, order);
  //   }

  //   // Удаление заказа по ID
  //   deleteOrder(orderId: string): Observable<any> {
  //     return this.http.delete(`${this.baseUrl}/order/${orderId}`);
  //   }
}
