import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AngularMaterialModule } from '../../angular-material.module';
import { CommonModule } from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { ProductService } from '../../shared/product.service';
import { Product } from '../../interfaces/product.interface';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { mimeType } from './mime-type.validator';
import { ProductDTO } from '../../shared/product.model';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AngularMaterialModule,
        CommonModule,
        MatProgressSpinnerModule
    ],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.scss'
})
export class CreateProductComponent implements OnInit {
    imagePreview: string = '';
    isLoading: boolean = false;
    createProductForm: FormGroup;
    private mode: 'create' | 'edit' = 'create';
    private productId: string | null = null;
    private product: any = null;



    constructor(private productService: ProductService, public route: ActivatedRoute, private router: Router) {
        this.createProductForm = new FormGroup({
            title: new FormControl(null, {
                validators: [Validators.required, Validators.minLength(3)],
            }),
            description: new FormControl(null, {
                validators: [Validators.required]
            }),
            price: new FormControl(null, {
                validators: [Validators.required]
            }),
            image: new FormControl(null as File | null, {
                validators: [Validators.required],
                asyncValidators: [mimeType]
            })
        });
    }

    ngOnInit(): void {
        console.log('init');
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if (paramMap.has('productId')) {
                this.mode = 'edit';
                this.productId = paramMap.get('productId')!;
                this.isLoading = true;
                this.productService.getProduct(this.productId).subscribe((productData: ProductDTO) => {
                    this.product = productData;
                    this.createProductForm.setValue({
                        title: this.product?.title ?? null,
                        description: this.product?.description ?? null,
                        price: this.product?.price ?? null,
                        image: this.product.imagePath ?? null
                    });
                    this.isLoading = false;
                });
            } else {
                this.mode = 'create';
                this.productId = null;
            }
        });
    }

    onSavePost(): void {
        if (this.createProductForm.invalid) {
            return
        }
        const product = {
            id: this.productId ?? null,
            title: this.createProductForm.value.title ?? '',
            description: this.createProductForm.value.description ?? '',
            price: this.createProductForm.value.price ?? 0,
            image: this.createProductForm.value.image ?? null
        };
        this.mode !== 'edit' ? this.productService.createProduct(product) : this.productService.updateProduct(product);
        this.isLoading = true;
        this.createProductForm.reset();
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
