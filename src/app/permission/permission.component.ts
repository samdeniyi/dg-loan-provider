import { Component, OnInit } from '@angular/core';

import EChartOption = echarts.EChartOption;
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Logger } from '@app/core/logger.service';
import { PermissionService } from './permission.service';
import { finalize, map, filter, toArray } from 'rxjs/operators';
import { Observable, range } from 'rxjs';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { removeDeletedItem, componentError, serverError } from '@app/helper';

const log = new Logger('home');

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss']
})
export class PermissionComponent implements OnInit {
  isLoading = false;
  permissions: any[] = [];
  modalTitle = 'Add New Permission';
  pageTitle = 'Permission';
  modalRef: NgbModalRef;
  doDeleteModalRef: NgbModalRef;
  formMode: any;
  selectedRowId: number;
  selectedRow: any;
  permissionForm: FormGroup;

  public sidebarVisible = true;
  public title = 'Permission';
  public breadcrumbItem: any = [
    {
      title: 'Permission',
      cssClass: 'active'
    }
  ];
  loader: boolean;
  formloader: boolean;

  constructor(
    private PermissionService: PermissionService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getPermission();
  }

  ngOnChanges() {}

  onSubmit() {
    this.formloader = true;
    if (this.permissionForm.valid) {
      switch (this.formMode) {
        case this.PermissionService.getFormMode().CREATE:
          this.onCreate(this.permissionForm.value);
          break;
        case this.PermissionService.getFormMode().UPDATE:
          this.onUpdate(this.permissionForm.value);
          break;
      }
    }
  }

  getPermission() {
    this.isLoading = true;

    this.PermissionService.getpermissions()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (res: any) => {
          if (res.responseCode === '00') {
            this.permissions = res.responseData;
            console.log(res.responseData);
          } else {
            console.error(res.message);
            componentError(res.message, this.toastr);
          }
        },
        error => serverError(error, this.toastr)
      );
  }

  onCreate(payload: any) {
    this.PermissionService.createpermission(payload)
      .pipe(
        finalize(() => {
          this.formloader = false;
          this.modalRef.close();
        })
      )
      .subscribe(
        res => {
          if (res.responseCode === '00') {
            this.getPermission();
            this.toastr.success(res.message, 'SUCCESS');
          } else {
            componentError(res.message, this.toastr);
          }
        },
        error => serverError(error, this.toastr)
      );
  }

  onUpdate(payload: any) {
    payload.id = this.selectedRow.id;

    this.PermissionService.updatepermission(payload)
      .pipe(
        finalize(() => {
          this.formloader = false;
          this.modalRef.close();
        })
      )
      .subscribe(
        res => {
          if (res.responseCode === '00') {
            this.getPermission();
            this.toastr.success(res.message, 'SUCCESS');
          } else {
            componentError(res.message, this.toastr);
          }
        },
        error => serverError(error, this.toastr)
      );
  }

  onViewModal(modal: any) {
    this.modalTitle = 'Add New Permission';

    this.formMode = this.PermissionService.getFormMode().CREATE;
    this.createForm();
    this.modalRef = this.modalService.open(modal, {
      windowClass: 'search',
      backdrop: false
    });
  }

  onViewRow(event: any, Permission: any, viewRole?: string) {
    this.formMode = this.PermissionService.getFormMode().UPDATE;
    this.selectedRow = event;
    this.selectedRowId = this.selectedRow.id;
    this.modalTitle = `Update Role - ${this.selectedRow.name}`;
    this.createForm();

    console.log(this.selectedRow);
    if (viewRole === 'VIEW') {
      this.createForm(viewRole);
      this.formMode = this.PermissionService.getFormMode().VIEW;
      this.modalTitle = `View Role - ${this.selectedRow.name}`;
    }

    this.permissionForm.patchValue({
      name: this.selectedRow.name,
      tenantId: this.selectedRow.tenantId
    });
    this.modalRef = this.modalService.open(Permission, {
      windowClass: 'search',
      backdrop: false
    });
  }

  onDelete(role: any, doDelete: any) {
    this.selectedRow = role;
    this.doDeleteModalRef = this.modalService.open(doDelete, {
      backdrop: true,
      backdropClass: 'light-blue-backdrop',
      size: 'sm',
      windowClass: 'confirmModal'
    });
  }

  onDoDelete(event: any) {
    this.formloader = true;
    this.PermissionService.deletepermission(this.selectedRow.id)
      .pipe(
        finalize(() => {
          this.formloader = false;
          this.modalService.dismissAll();
          this.resetFormMode();
        })
      )
      .subscribe(
        (res: any) => {
          if (res.status === true) {
            this.permissions = removeDeletedItem(this.permissions, this.selectedRow.id);
            this.toastr.success(res.message, 'SUCCESS');
          } else {
            componentError(res, this.toastr);
          }
        },
        (error: any) => serverError(error, this.toastr)
      );
  }

  resetFormMode() {
    this.formMode = this.PermissionService.getFormMode().CREATE;
  }

  createForm(formMode: any = null) {
    const isDisabled = formMode === 'VIEW' ? true : false;

    this.permissionForm = this.formBuilder.group({
      name: [{ value: '', disabled: isDisabled }, [Validators.required]]
    });
  }
}
