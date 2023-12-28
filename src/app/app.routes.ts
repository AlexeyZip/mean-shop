import { Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { ProductPageComponent } from './product-page/product-page.component';
import { DashboardPageComponent } from './admin/dashboard-page/dashboard-page.component';
import { CreateProductComponent } from './admin/create-product/create-product.component';

export const routes: Routes = [
    {
        path: '',
        component: MainPageComponent,
        children: [
            { path: 'product', component: ProductPageComponent },
            // { path: 'create-product', component: CreateProductComponent }
        ]
    },
    {
        path: 'admin',
        component: DashboardPageComponent,
        children: [
            { path: 'createProduct', component: CreateProductComponent}
        ]
    } 
    // {
    //     path: 'create-product', component: CreateProductComponent
    // }
];
