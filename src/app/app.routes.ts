import { Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { CartComponent } from './cart/cart.component';
import { ProductPageComponent } from './product-page/product-page.component';
import { ProductDetailsComponent } from './product-details/product-details.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./main-page/main-page.component').then(
        (m) => m.MainPageComponent
      ),
    children: [
      { path: 'product/:category', component: ProductPageComponent },
      { path: 'product', redirectTo: 'product/all', pathMatch: 'full' },
      { path: 'details/:productId', component: ProductDetailsComponent },
      { path: 'cart', component: CartComponent },
      //   { path: '**', redirectTo: 'product/all' },
    ],
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./auth/signup/signup.component').then((m) => m.SignupnComponent),
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./admin/dashboard-page/dashboard-page.component').then(
        (m) => m.DashboardPageComponent
      ),
    canActivate: [AuthGuard],
    children: [
      {
        path: 'createProduct',
        loadComponent: () =>
          import('./admin/create-product/create-product.component').then(
            (m) => m.CreateProductComponent
          ),
      },
      {
        path: 'edit/:productId',
        loadComponent: () =>
          import('./admin/create-product/create-product.component').then(
            (m) => m.CreateProductComponent
          ),
      },
      {
        path: 'productList',
        loadComponent: () =>
          import('./admin/product-list/product-list.component').then(
            (m) => m.ProductListComponent
          ),
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./admin/orders-page/orders-page.component').then(
            (m) => m.OrdersComponent
          ),
      },
    ],
  },
];
