import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Shell } from '@app/shell/shell.service';
import { AboutComponent } from './about.component';
import { extract } from '@app/core/i18n.service';

const routes: Routes = [
  Shell.childRoutes([{ path: 'about', component: AboutComponent, data: { title: extract('About') } }])
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class AboutRoutingModule {}
