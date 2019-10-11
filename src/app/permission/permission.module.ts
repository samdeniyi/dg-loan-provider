import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@app/shared';
import { PermissionComponent } from './permission.component';
import { ReactiveFormsModule } from '@angular/forms';
import { PermissionRoutingModule } from './permission-routing.module';
@NgModule({
  declarations: [PermissionComponent],
  imports: [CommonModule, SharedModule, PermissionRoutingModule, ReactiveFormsModule]
})
export class PermissionModule {}
