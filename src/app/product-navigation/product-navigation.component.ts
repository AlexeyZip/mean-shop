import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { AngularMaterialModule } from '../angular-material.module';

@Component({
  selector: 'app-product-navigation',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AngularMaterialModule
  ],
  templateUrl: './product-navigation.component.html',
  styleUrl: './product-navigation.component.scss'
})
export class ProductNavigationComponent {

}
