import { Component } from '@angular/core';
import {
    FormControl,
    FormGroupDirective,
    NgForm,
    Validators,
    FormsModule,
    ReactiveFormsModule,
  } from '@angular/forms';
import { Router, RouterLinkActive } from '@angular/router';
import { RouterModule, Routes } from '@angular/router';
import { ProductNavigationComponent } from '../product-navigation/product-navigation.component';
import { AngularMaterialModule } from '../angular-material.module';

@Component({
  selector: 'app-main-page',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ProductNavigationComponent,
    AngularMaterialModule
],
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss'
})
export class MainPageComponent {
    constructor(
        public router: Router
    ) {

    }

}
