import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoanProductsRoutingModule } from './loan-products-routing.module';
import { LoanProductsComponent } from './loan-products.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { ListProductsComponent } from './list-products/list-products.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared';
import { EditProductComponent } from './edit-product/edit-product.component';

@NgModule({
  declarations: [LoanProductsComponent, CreateProductComponent, ListProductsComponent, EditProductComponent],
  imports: [CommonModule, LoanProductsRoutingModule, ReactiveFormsModule, SharedModule]
})
export class LoanProductsModule {}
