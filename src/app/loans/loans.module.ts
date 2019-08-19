import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoansRoutingModule } from './loans-routing.module';
import { LoansComponent } from './loans.component';
import { PendingDisbursementsComponent } from '@app/loans/pending-disbursements/pending-disbursements.component';
import { ApprovalListComponent } from './approval-list/approval-list.component';
import { SharedModule } from '@app/shared';

@NgModule({
  declarations: [LoansComponent, PendingDisbursementsComponent, ApprovalListComponent],
  imports: [CommonModule, LoansRoutingModule, SharedModule]
})
export class LoansModule {}
