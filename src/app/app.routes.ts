import { Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { ProductPageComponent } from './product-page/product-page.component';
import { DashboardPageComponent } from './admin/dashboard-page/dashboard-page.component';
import { CreateProductComponent } from './admin/create-product/create-product.component';
import { ProductListComponent } from './admin/product-list/product-list.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupnComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
    children: [
      { path: 'product', component: ProductPageComponent },
      { path: 'details/:productId', component: ProductDetailsComponent },
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupnComponent },
  {
    path: 'admin',
    component: DashboardPageComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'createProduct',
        component: CreateProductComponent,
        // canActivate: [AuthGuard],
      },
      {
        path: 'edit/:productId',
        component: CreateProductComponent,
        // canActivate: [AuthGuard],
      },
      { path: 'productList', component: ProductListComponent },
    ],
  },
];
