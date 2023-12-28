import { Component, OnInit } from '@angular/core';
import { ProductService } from '../shared/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.scss'
})
export class ProductPageComponent implements OnInit {
    constructor(private productService: ProductService) {}
    products: any[] = [];
    ngOnInit(): void {
        this.products = this.productService.getProducts();
        console.log(this.products);
    }
}
