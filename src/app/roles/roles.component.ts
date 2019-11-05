import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Logger } from '@app/core/logger.service';
import { RolesService } from './roles.service';
import { finalize } from 'rxjs/operators';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { removeDeletedItem, componentError, serverError } from '@app/helper';

const log = new Logger('home');

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  isLoading = false;
  roles: any[] = [];
  rolePermissions: any[] = [];
  modalTitle = 'Add New Role';
  pageTitle = 'Roles';
  modalRef: NgbModalRef;
  doDeleteModalRef: NgbModalRef;
  formMode: any;
  selectedRowId: number;
  selectedRow: any;
  rolesForm: FormGroup;

  public sidebarVisible = true;
  public title = 'Roles';
  public breadcrumbItem: any = [
    {
      title: 'Roles',
      cssClass: 'active'
    }
  ];
  loader: boolean;
  formloader: boolean;

  constructor(
    private rolesService: RolesService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.getRoles();
  }

  ngOnChanges() {}

  onSubmit() {
    this.formloader = true;
    if (this.rolesForm.valid) {
      switch (this.formMode) {
        case this.rolesService.getFormMode().CREATE:
          this.onCreate(this.rolesForm.value);
          break;
        case this.rolesService.getFormMode().UPDATE:
          this.onUpdate(this.rolesForm.value);
          break;
      }
    }
  }

  getRoles() {
    this.isLoading = true;

    this.rolesService
      .getroles()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (res: any) => {
          if (res.responseCode === '00') {
            this.roles = res.responseData;
            console.log(res.responseData);
          } else {
            console.error(res.message);
            componentError(res.message, this.toastr);
          }
        },
        error => serverError(error, this.toastr)
      );
  }
  getRolePermissions() {
    this.isLoading = true;

    this.rolesService
      .getrolepermissions()
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (res: any) => {
          if (res.responseCode === '00') {
            this.rolePermissions = res.responseData;
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
    this.rolesService
      .createrole(payload)
      .pipe(
        finalize(() => {
          this.formloader = false;
          this.modalRef.close();
        })
      )
      .subscribe(
        res => {
          if (res.responseCode === '00') {
            this.getRoles();
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

    this.rolesService
      .updaterole(payload)
      .pipe(
        finalize(() => {
          this.formloader = false;
          this.modalRef.close();
        })
      )
      .subscribe(
        res => {
          if (res.responseCode === '00') {
            this.getRoles();
            this.toastr.success(res.message, 'SUCCESS');
          } else {
            componentError(res.message, this.toastr);
          }
        },
        error => serverError(error, this.toastr)
      );
  }

  onViewModal(modal: any) {
    this.getRolePermissions();

    this.modalTitle = 'Add New Role';

    this.formMode = this.rolesService.getFormMode().CREATE;
    this.createForm();
    this.modalRef = this.modalService.open(modal, {
      windowClass: 'search',
      backdrop: false
    });
  }

  onViewRow(event: any, Roles: any, viewRole?: string) {
    this.getRolePermissions();
    this.formMode = this.rolesService.getFormMode().UPDATE;
    this.selectedRow = event;
    this.selectedRowId = this.selectedRow.id;
    this.modalTitle = `Update Role - ${this.selectedRow.name}`;
    this.createForm();

    console.log(this.selectedRow);
    if (viewRole === 'VIEW') {
      this.createForm(viewRole);
      this.formMode = this.rolesService.getFormMode().VIEW;
      this.modalTitle = `View Role - ${this.selectedRow.name}`;
    }

    this.rolesForm.patchValue({
      name: this.selectedRow.name,
      tenantId: this.selectedRow.tenantId
    });
    this.modalRef = this.modalService.open(Roles, {
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
    this.rolesService
      .deleteRole(this.selectedRow.id)
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
            this.roles = removeDeletedItem(this.roles, this.selectedRow.id);
            this.toastr.success(res.message, 'SUCCESS');
          } else {
            componentError(res, this.toastr);
          }
        },
        (error: any) => serverError(error, this.toastr)
      );
  }

  resetFormMode() {
    this.formMode = this.rolesService.getFormMode().CREATE;
  }

  createForm(formMode: any = null) {
    const isDisabled = formMode === 'VIEW' ? true : false;

    this.rolesForm = this.formBuilder.group({
      name: [{ value: '', disabled: isDisabled }, [Validators.required]]
    });
  }
}
