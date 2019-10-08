import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared';
import { RolesRoutingModule } from './roles-routing.module';
import { RolesComponent } from './roles.component';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [RolesComponent],
  imports: [CommonModule, RolesRoutingModule, SharedModule, ReactiveFormsModule]
})
export class RolesModule {}
