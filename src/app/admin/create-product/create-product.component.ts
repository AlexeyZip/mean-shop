import { Component, DestroyRef, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AngularMaterialModule } from '../../angular-material.module';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductService } from '../../shared/product.service';
import { Product } from '../../interfaces/product.interface';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    CommonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.scss',
})
export class CreateProductComponent implements OnInit {
  imagePreview: string = '';
  isLoading: boolean = false;
  createProductForm: FormGroup;
  private mode: 'create' | 'edit' = 'create';
  private productId: string | null = null;
  private product: any = null;
  private userId: string | null = null;

  constructor(
    private productService: ProductService,
    public route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private destroyRef: DestroyRef
  ) {
    this.createProductForm = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      description: new FormControl(null, {
        validators: [Validators.required],
      }),
      price: new FormControl(null, {
        validators: [Validators.required],
      }),
      image: new FormControl(null as File | null, {
        validators: [Validators.required],
      }),
    });
  }

  ngOnInit(): void {
    this.authService
      .getAuthStatusListener()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((authStatus) => {
        this.isLoading = false;
      });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('productId')) {
        this.mode = 'edit';
        this.productId = paramMap.get('productId')!;
        this.isLoading = true;
        this.userId = this.authService.getUserId();
        this.productService
          .getProduct(this.productId)
          .subscribe((productData: Product) => {
            this.product = productData;
            console.log(this.product);
            this.createProductForm.setValue({
              title: this.product?.title ?? null,
              description: this.product?.description ?? null,
              price: this.product?.price ?? null,
              image: this.product.imagePath ?? null,
            });
            this.isLoading = false;
          });
      } else {
        this.mode = 'create';
        this.productId = null;
      }
    });
  }

  onSaveProduct(): void {
    if (this.createProductForm.invalid) {
      return;
    }
    this.isLoading = true;
    const product = {
      id: this.productId ?? null,
      title: this.createProductForm.value.title ?? '',
      description: this.createProductForm.value.description ?? '',
      price: this.createProductForm.value.price ?? 0,
      image: this.createProductForm.value.image ?? null,
      creator: this.userId,
    };

    if (this.mode === 'create') {
      this.productService.createProduct(product).subscribe({
        next: () => {
          this.isLoading = false;
          this.createProductForm.reset();
          this.router.navigate(['/admin/productList']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error creating product:', error);
        },
      });
    } else {
      this.productService.updateProduct(product).subscribe({
        next: () => {
          this.isLoading = false;
          this.createProductForm.reset();
          this.router.navigate(['/admin/productList']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error updating product:', error);
        },
      });
    }
  }

  onImagePicked(event: Event): void {
    const inputElement = event.target as HTMLInputElement;

    if (inputElement.files && inputElement.files.length > 0) {
      const file = inputElement.files[0]!;

      this.createProductForm.patchValue({ image: file });
      this.createProductForm.get('image')?.updateValueAndValidity();

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
}
