import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Product } from '../../interfaces/product.interface';
import { ProductService } from '../../shared/product.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [MatIconModule, MatTableModule, RouterModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent {
    products: any[] = [];
    displayedColumns: string[] = ['title', 'description', 'price', 'actions'];
    private productSub: Subscription = new Subscription;
    constructor(private productService: ProductService) {}
    ngOnInit(): void {
        this.productService.getProductUpdateListener()
            .subscribe((products: Product[]) => {
                this.products = products;
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
