import { Injectable } from "@angular/core";
import { Product } from "../interfaces/product.interface";
import { Subject } from "rxjs";
import { HttpClient, HttpClientModule } from "@angular/common/http";

@Injectable({
    providedIn: 'root',
  })
export class ProductService {
    private products: Product[] = [];
    private productUpdated = new Subject<Product[]>();
    constructor(private http: HttpClient) {}

    private productsKey = 'products';

    createProduct(product: Product): void {
        const newProduct = {
            id: product.id,
            title: product.title,
            description: product.description,
            image: product.image
        }
        this.http.post<{message: string}>('http://localhost:3000/api/products', newProduct)
            .subscribe((responseData: any) => {
                console.log('responseData', responseData);
                this.products.push(newProduct);
                this.productUpdated.next([...this.products])
            });
    }

    getProductUpdateListener() {
        return this.productUpdated.asObservable();
    }
    
    getProducts(): any {
        this.http.get<{message: string, products: Product[]}>('http://localhost:3000/api/products')
            .subscribe((productData) => {
                console.log('productData', productData);
                this.products = productData.products;
                this.productUpdated.next([...this.products]);
            });
    }
}