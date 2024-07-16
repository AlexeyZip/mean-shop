import { Component } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AngularMaterialModule } from '../../angular-material.module';
import { ProductNavigationComponent } from '../../product-navigation/product-navigation.component';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../auth.service';

@Component({
  standalone: true,
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
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
  constructor(private authService: AuthService) {}

  onSignup(form: NgForm): void {
    if (form.invalid) return;
    const { email, password } = form.value;
    this.isLoading = true;
    this.authService.createUser(email, password);
  }
}
