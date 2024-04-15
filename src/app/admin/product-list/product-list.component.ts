import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Product } from '../../interfaces/product.interface';
import { ProductService } from '../../shared/product.service';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [MatIconModule, CommonModule, MatTableModule, RouterModule, MatProgressSpinnerModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {
    products: any[] = [];
    isLoading: boolean = false;
    displayedColumns: string[] = ['title', 'description', 'price', 'actions'];
    private productSub: Subscription = new Subscription;
    constructor(private productService: ProductService) {}
    ngOnInit(): void {
        this.isLoading = true;
        this.productService.getProductUpdateListener()
            .subscribe((products: Product[]) => {
                this.products = products;
                this.isLoading = false;
            });
        this.productService.getProducts();
    }

    delete(productId: string) {
        this.productService.deleteProduct(productId);
    }

    ngOnDestroy(): void {
        this.productSub.unsubscribe();
    }

}
