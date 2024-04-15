import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AngularMaterialModule } from '../../angular-material.module';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../shared/product.service';
import { Product } from '../../interfaces/product.interface';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

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
    private mode: 'create' | 'edit' = 'create';
    private productId: string | null = null;
    private product: Product | null = null;


    createProductForm = new FormGroup({
        title: new FormControl('', {
            validators: [Validators.required, Validators.minLength(3)],
        }),
        description: new FormControl('', {
            validators: [Validators.required]
        }),
        price: new FormControl(0, {
            validators: [Validators.required]
        }),
        image: new FormControl(null as File | null, {
            validators: [Validators.required],
            // asyncValidators: [mimeType]
        })
    })

    constructor(private productService: ProductService, public route: ActivatedRoute, private router: Router) {}

    ngOnInit(): void {
        console.log('init');
        
        this.route.paramMap.subscribe((paramMap: ParamMap) => {
            if (paramMap.has('productId')) {
                this.mode = 'edit';
                this.productId = paramMap.get('productId')!;
                this.productService.getProduct(this.productId).subscribe((productData: Product) => {
                    this.product = productData;
                    console.log(this.product);
                    
                    this.createProductForm.setValue({
                        title: this.product?.title ?? null,
                        description: this.product?.description ?? null,
                        price: this.product?.price ?? null,
                        image: null
                    });
                });
            } else {
                this.mode = 'create';
                this.productId = null;
            }
        });
    }

    onSavePost(): void {
        console.log('save');
        
        const product = {
            id: this.productId ?? null,
            title: this.createProductForm.value.title ?? '',
            description: this.createProductForm.value.description ?? '',
            price: this.createProductForm.value.price ?? 0,
            image: this.createProductForm.value.image ?? null
        };
        this.mode !== 'edit' ? this.productService.createProduct(product) : this.productService.updateProduct(product);
        this.createProductForm.reset();

        //CODE BELOW NAVIGATE TO PRODUCTS LIST RIGHT AFTER PRODUCT WAS SAVED
        // let saveObservable: Observable<void>;

        // if (this.mode !== 'edit') {
        //     saveObservable = this.productService.createProduct(product);
        // } else {
        //     saveObservable = this.productService.updateProduct(product);
        // }

        // saveObservable.subscribe({
        //     next: (response) => {
        //         this.createProductForm.reset();
        //         this.router.navigate(['/admin/productList']);
        //     },
        //     error: (error) => {
        //         console.error('Failed to save product:', error);
        //     }
        // });
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
