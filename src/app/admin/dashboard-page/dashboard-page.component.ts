import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AngularMaterialModule } from '../../angular-material.module';
import { ProductNavigationComponent } from '../../product-navigation/product-navigation.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    ProductNavigationComponent,
    AngularMaterialModule
],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss'
})
export class DashboardPageComponent {

}
