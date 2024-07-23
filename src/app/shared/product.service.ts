import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Product } from './product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private products: Product[] = [];
  private productUpdated = new Subject<{
    products: Product[];
    productCount: number;
  }>();

  private productsPerPage: number = 2;
  private currentPage: number = 1;

  constructor(private http: HttpClient, private router: Router) {}

  createProduct(
    product: Product
  ): Observable<{ message: string; product: Product }> {
    const productData = new FormData();
    productData.append('title', product.title);
    productData.append('description', product.description);
    productData.append('price', product.price.toString());
    productData.append('image', product.image, product.title);
    console.log('Creating product:', product);
    return this.http
      .post<{ message: string; product: Product }>(
        'http://localhost:3000/api/products',
        productData
      )
      .pipe(
        tap((response) => {
          console.log('Product created:', response);
          this.getProducts(); // Обновляем продукты после создания
        }),
        catchError((error) => {
          console.error('Error creating product:', error);
          throw error;
        })
      );
  }

  updateProduct(product: Product | any): Observable<{ message: string }> {
    let productData: Product | FormData;
    console.log(product);
    if (typeof product.image === 'object') {
      productData = new FormData();
      productData.append('id', product.id);
      productData.append('title', product.title);
      productData.append('description', product.description);
      productData.append('price', product.price.toString());
      productData.append('image', product.image, product.title);
    } else {
      product.creator = null;
      productData = product;
    }
    console.log('Updating product:', product);
    return this.http
      .put<{ message: string }>(
        'http://localhost:3000/api/products/' + product.id,
        productData
      )
      .pipe(
        tap((response) => {
          console.log('Product updated:', response);
          this.getProducts(); // Обновляем продукты после обновления
        }),
        catchError((error) => {
          console.error('Error updating product:', error);
          throw error;
        })
      );
  }

  getProductUpdateListener() {
    return this.productUpdated.asObservable();
  }

  getProducts(): void {
    const queryParams = `?pagesize=${this.productsPerPage}&page=${this.currentPage}`;
    console.log('Fetching products with params:', queryParams);
    this.http
      .get<{ message: string; products: Product[]; maxProducts: number }>(
        'http://localhost:3000/api/products' + queryParams
      )
      .pipe(
        map((productData) => {
          console.log('Product data from server:', productData);
          return {
            products: productData.products.map((product: any) => {
              return {
                title: product.title,
                description: product.description,
                price: product.price,
                id: product._id,
                imagePath: product.imagePath,
                creator: product.creator,
              };
            }),
            maxProducts: productData.maxProducts,
          };
        }),
        catchError((error) => {
          console.error('Error fetching products:', error);
          throw error;
        })
      )
      .subscribe((transformedProductData) => {
        console.log('Transformed products:', transformedProductData);
        this.products = transformedProductData.products;
        this.productUpdated.next({
          products: [...this.products],
          productCount: transformedProductData.maxProducts,
        });
      });
  }

  getProduct(id: string): Observable<Product> {
    console.log('Fetching product with id:', id);
    return this.http
      .get<Product>('http://localhost:3000/api/products/' + id)
      .pipe(
        catchError((error) => {
          console.error('Error fetching product:', error);
          throw error;
        })
      );
  }

  deleteProduct(productId: string): Observable<any> {
    console.log('Deleting product with id:', productId);
    return this.http
      .delete('http://localhost:3000/api/products/' + productId)
      .pipe(
        tap(() => {
          const updatedProducts = this.products.filter(
            (product: any) => product.id !== productId
          );
          this.products = updatedProducts;
          this.productUpdated.next({
            products: [...this.products],
            productCount: this.products.length,
          });
        }),
        catchError((error) => {
          console.error('Error deleting product:', error);
          throw error;
        })
      );
  }

  setPaginationParams(productsPerPage: number, currentPage: number) {
    this.productsPerPage = productsPerPage;
    this.currentPage = currentPage;
    console.log(
      'Pagination params set:',
      this.productsPerPage,
      this.currentPage
    );
  }
}
