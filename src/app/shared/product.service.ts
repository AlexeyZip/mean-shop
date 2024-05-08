import { Injectable } from "@angular/core";
import { Product } from "../interfaces/product.interface";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { Router } from "@angular/router";
import { ProductDTO } from "./product.model";

@Injectable({
    providedIn: 'root',
  })
export class ProductService {
    private products: Product[] = [];
    private productUpdated = new Subject<Product[]>();
    constructor(private http: HttpClient, private router: Router) {}

    private productsKey = 'products';

    createProduct(product: Product): void {
        const productData = new FormData();
        productData.append("title", product.title);
        productData.append("description", product.description);
        productData.append("price", product.price.toString());
        productData.append("image", product.image, product.title);
        this.http.post<{message: string, product: ProductDTO}>('http://localhost:3000/api/products', productData)
            .subscribe((responseData: any) => {
                const newProduct: ProductDTO = {
                    ...product,
                    id: responseData.product.id,
                    imagePath: responseData.product.imagePath

                }
                this.products.push(newProduct);
                this.productUpdated.next([...this.products]);
                this.router.navigate(['/admin/productList']);
            });
    }
    
    updateProduct(product: Product | any): void {
        let productData: Product | FormData;
        if (typeof(product.image) === 'object') {
            productData = new FormData();
            productData.append("id", product.id);
            productData.append("title", product.title);
            productData.append("description", product.description);
            productData.append("price", product.price.toString());
            productData.append("image", product.image, product.title);
        } else {
            productData = product;
        }
        this.http.put('http://localhost:3000/api/products/' + product.id, productData)
        .subscribe(responseData => {
        const updatedProducts = [...this.products];
            const oldProductIndex = updatedProducts.findIndex(p => p.id === product.id);
            const productObject = {
                id: product.id,
                title: product.title,
                description: product.description,
                price: product.price,
                imagePath: "",
            } 
            updatedProducts[oldProductIndex] = product;
            this.products = updatedProducts;
            this.productUpdated.next([...this.products]);
            this.router.navigate(['/admin/productList']);
        }
        );
    }

    getProductUpdateListener() {
        return this.productUpdated.asObservable();
    }

    getProduct(id: string) {
        return this.http.get<ProductDTO>('http://localhost:3000/api/products/' + id);
    }
    
    getProducts(): any {
        this.http.get<{message: string, products: Product[]}>('http://localhost:3000/api/products')
        .pipe(map((productData) => {
            return productData.products.map((product: any) => {
                return {
                    title: product.title,
                    description: product.description,
                    price: product.price,
                    id: product._id,
                    imagePath: product.imagePath
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