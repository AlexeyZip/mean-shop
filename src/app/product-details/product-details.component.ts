import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap, RouterModule } from '@angular/router';
import { ProductService } from '../shared/product.service';
import { Product } from '../shared/product.model';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CreateProductComponent } from '../admin/create-product/create-product.component';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [
    CommonModule,
    CreateProductComponent,
    MatCardModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss',
})
export class ProductDetailsComponent {
  private productId: string | null = null;
  public product: any = null;
  imagePreview: string = '';

  constructor(
    public route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('productId')) {
        this.productId = paramMap.get('productId')!;
        this.productService
          .getProduct(this.productId)
          .subscribe((productData: Product) => {
            this.product = productData;
          });
      } else {
        this.productId = null;
      }
    });
  }
}
