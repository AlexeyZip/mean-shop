import { Component } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AngularMaterialModule } from '../../angular-material.module';
import { ProductNavigationComponent } from '../../product-navigation/product-navigation.component';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  standalone: true,
  templateUrl: './signup.component.html',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    CommonModule,
    MatProgressSpinnerModule,
    FormsModule,
  ],
})
export class SignupnComponent {
  isLoading = false;

  onSignup(form: NgForm): void {
    console.log(form);
  }
}
