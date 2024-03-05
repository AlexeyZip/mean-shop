import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AngularMaterialModule } from '../../angular-material.module';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../shared/product.service';
import { Product } from '../../interfaces/product.interface';

@Component({
  selector: 'app-create-product',
  standalone: true,
  imports: [
        FormsModule,
        ReactiveFormsModule,
        AngularMaterialModule,
        CommonModule
    ],
  templateUrl: './create-product.component.html',
  styleUrl: './create-product.component.scss'
})
export class CreateProductComponent implements OnInit {
    imagePreview: string = '';
    createProductForm = new FormGroup({
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
            // asyncValidators: [mimeType]
        })
    })

    constructor(private productService: ProductService) {}

    ngOnInit(): void {
        
    }

    onSavePost(): void {
        const product: Product = {
            id: null,
            title: this.createProductForm.value.title ?? '',
            description: this.createProductForm.value.description ?? '',
            price: this.createProductForm.value.price ?? 0,
            image: this.createProductForm.value.image ?? null
        };
        this.productService.createProduct(product);
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
