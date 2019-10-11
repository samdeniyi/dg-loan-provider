import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { extract } from '@app/core/i18n.service';
import { PermissionComponent } from './permission.component';

const routes: Routes = [
  Shell.childRoutes([
    { path: '', redirectTo: '/permission', pathMatch: 'full' },
    { path: 'permission', component: PermissionComponent, data: { title: extract('Permission') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermissionRoutingModule {}
