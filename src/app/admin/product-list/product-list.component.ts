import { Component } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatTableModule} from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Product } from '../../interfaces/product.interface';
import { ProductService } from '../../shared/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [MatIconModule, MatTableModule],
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
    edit(element: any) {
        console.log('edit', element);
    }

    delete(productId: string) {
        this.productService.deleteProduct(productId);
    }

    ngOnDestroy(): void {
        this.productSub.unsubscribe();
    }

}
