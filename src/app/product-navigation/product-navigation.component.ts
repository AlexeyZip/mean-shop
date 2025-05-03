import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AngularMaterialModule } from '../angular-material.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-product-navigation',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AngularMaterialModule,
    MatButtonModule,
    MatMenuModule,
  ],
  templateUrl: './product-navigation.component.html',
  styleUrl: './product-navigation.component.scss',
})
export class ProductNavigationComponent {}
