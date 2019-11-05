import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { extract } from '@app/core/i18n.service';
import { ReportsComponent } from './reports.component';

const routes: Routes = [
  Shell.childRoutes([
    { path: '', redirectTo: '/reports', pathMatch: 'full' },
    { path: 'reports', component: ReportsComponent, data: { title: extract('Reports') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule {}
