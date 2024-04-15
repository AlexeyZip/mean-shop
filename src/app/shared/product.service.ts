import { Injectable } from "@angular/core";
import { Product } from "../interfaces/product.interface";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
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
            price: product.price,
            image: product.image
        }
        this.http.post<{message: string, poductId: string}>('http://localhost:3000/api/products', newProduct)
            .subscribe((responseData: any) => {
                const id = responseData.poductId;
                newProduct.id = id;
                this.products.push(newProduct);
                this.productUpdated.next([...this.products])
            });
    }
    
    updateProduct(product: Product): void {
        this.http.put('http://localhost:3000/api/products/' + product.id, product)
        .subscribe(responseData => {
        const updatedProducts = [...this.products];
            const oldProductIndex = updatedProducts.findIndex(p => p.id === product.id);
            updatedProducts[oldProductIndex] = product;
            this.products = updatedProducts;
            this.productUpdated.next([...this.products]);
        }
        );
    }

    getProductUpdateListener() {
        return this.productUpdated.asObservable();
    }

    getProduct(id: string) {
        return this.http.get<Product>('http://localhost:3000/api/products/' + id);
    }
    
    getProducts(): any {
        this.http.get<{message: string, products: Product[]}>('http://localhost:3000/api/products')
        .pipe(map((productData) => {
            return productData.products.map((product: any) => {
                return {
                    title: product.title,
                    description: product.description,
                    price: product.price,
                    id: product._id
                }
            })
        }))
        .subscribe(transformedProducts => {
                console.log('productData', transformedProducts);
                this.products = transformedProducts;
                this.productUpdated.next([...this.products]);
            });
    }

    deleteProduct(productId: string): any {
        this.http.delete('http://localhost:3000/api/products/' + productId)
            .subscribe(() => {
                const updatedProducts = this.products.filter((product: any) => product.id !== productId);
                this.products = updatedProducts;
                this.productUpdated.next([...this.products]);
            })
        
    }
}