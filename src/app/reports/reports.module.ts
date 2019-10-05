import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared';
import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import { MomentModule } from 'ngx-moment';
import { ChartsModule } from 'ng2-charts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
@NgModule({
  declarations: [ReportsComponent],
  imports: [CommonModule, ReportsRoutingModule, SharedModule, MomentModule, ChartsModule, NgbModule]
})
export class ReportsModule {}
