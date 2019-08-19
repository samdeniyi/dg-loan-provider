import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { CreateProductComponent } from '@app/loan-products/create-product/create-product.component';
import { extract } from '@app/core/i18n.service';
import { ListProductsComponent } from '@app/loan-products/list-products/list-products.component';
import { ApprovalListComponent } from '@app/loans/approval-list/approval-list.component';
import { PendingDisbursementsComponent } from '@app/loans/pending-disbursements/pending-disbursements.component';

const routes: Routes = [
  Shell.childRoutes([
    { path: '', redirectTo: '/admin', pathMatch: 'full' },
    { path: 'approvals', component: ApprovalListComponent, data: { title: extract('Approval list') } },
    { path: 'pending', component: PendingDisbursementsComponent, data: { title: extract('Pending disbursement') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoansRoutingModule {}
