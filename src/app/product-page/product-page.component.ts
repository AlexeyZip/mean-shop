import { Component, OnDestroy, OnInit } from '@angular/core';
import { ProductService } from '../shared/product.service';
import { CommonModule } from '@angular/common';
import { Product } from '../interfaces/product.interface';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CreateProductComponent } from '../admin/create-product/create-product.component';

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [CommonModule, CreateProductComponent],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.scss'
})
export class ProductPageComponent implements OnInit, OnDestroy {
    products: any[] = [];
    private productSub: Subscription = new Subscription;
    constructor(private productService: ProductService) {}
    ngOnInit(): void {
        this.productService.getProductUpdateListener()
            .subscribe((products: Product[]) => {
                this.products = products;
            });
        this.productService.getProducts();
    }

    onDelete(productId: string): void {
        this.productService.deleteProduct(productId);
    }

    ngOnDestroy(): void {
        this.productSub.unsubscribe();
    }
}
