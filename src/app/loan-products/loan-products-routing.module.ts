import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { CreateProductComponent } from '@app/loan-products/create-product/create-product.component';
import { ListProductsComponent } from '@app/loan-products/list-products/list-products.component';
import { extract } from '@app/core/i18n.service';
import { EditProductComponent } from './edit-product/edit-product.component';

const routes: Routes = [
  Shell.childRoutes([
    { path: '', redirectTo: '/admin', pathMatch: 'full' },
    { path: 'create', component: CreateProductComponent, data: { title: extract('Create loan product') } },
    { path: 'list', component: ListProductsComponent, data: { title: extract('list loan products') } },
    { path: ':id', component: EditProductComponent, data: { title: extract('edit loan product') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanProductsRoutingModule {}
