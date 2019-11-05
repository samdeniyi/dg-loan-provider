import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Shell } from '@app/shell/shell.service';
import { extract } from '@app/core/i18n.service';
import { RolesComponent } from './roles.component';

const routes: Routes = [
  Shell.childRoutes([
    { path: '', redirectTo: '/role', pathMatch: 'full' },
    { path: 'role', component: RolesComponent, data: { title: extract('Role') } }
  ])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule {}
