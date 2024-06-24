import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpClientModule } from '@angular/common/http';
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
  constructor(private http: HttpClient, private router: Router) {}

  private productsKey = 'products';

  createProduct(product: Product): void {
    const productData = new FormData();
    productData.append('title', product.title);
    productData.append('description', product.description);
    productData.append('price', product.price.toString());
    productData.append('image', product.image, product.title);
    this.http
      .post<{ message: string; product: Product }>(
        'http://localhost:3000/api/products',
        productData
      )
      .subscribe((responseData: any) => {
        this.router.navigate(['/admin/productList']);
      });
  }

  updateProduct(product: Product | any): void {
    let productData: Product | FormData;
    if (typeof product.image === 'object') {
      productData = new FormData();
      productData.append('id', product.id);
      productData.append('title', product.title);
      productData.append('description', product.description);
      productData.append('price', product.price.toString());
      productData.append('image', product.image, product.title);
    } else {
      productData = product;
    }
    this.http
      .put('http://localhost:3000/api/products/' + product.id, productData)
      .subscribe((responseData) => {
        this.router.navigate(['/admin/productList']);
      });
  }

  getProductUpdateListener() {
    return this.productUpdated.asObservable();
  }

  getProduct(id: string) {
    return this.http.get<Product>('http://localhost:3000/api/products/' + id);
  }

  getProducts(productsPerPage: number, currentPage: number): any {
    const queryParams = `?pagesize=${productsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; products: Product[]; maxProducts: number }>(
        'http://localhost:3000/api/products' + queryParams
      )
      .pipe(
        map((productData) => {
          return {
            products: productData.products.map((product: any) => {
              return {
                title: product.title,
                description: product.description,
                price: product.price,
                id: product._id,
                imagePath: product.imagePath,
              };
            }),
            maxProducts: productData.maxProducts,
          };
        })
      )
      .subscribe((transformedProductData) => {
        this.products = transformedProductData.products;
        this.productUpdated.next({
          products: [...this.products],
          productCount: transformedProductData.maxProducts,
        });
      });
  }

  deleteProduct(productId: string): any {
    return this.http.delete('http://localhost:3000/api/products/' + productId);
  }
}
