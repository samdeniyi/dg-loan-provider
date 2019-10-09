import { Component, OnInit } from '@angular/core';

import EChartOption = echarts.EChartOption;
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Logger } from '@app/core/logger.service';
import { RolesService } from './roles.service';
import { finalize, map, filter, toArray } from 'rxjs/operators';
import { Observable, range } from 'rxjs';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

const log = new Logger('home');

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  isLoading = false;
  roles: any[] = [];
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

  ngOnInit() {}

  ngOnChanges() {}

  onSubmit() {}

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
          }
        },
        (error: any) => {
          console.error(error);
        }
      );
  }

  onViewModal(modal: any) {
    // this.getPermission();
    this.modalTitle = 'Add New Role';

    this.formMode = this.rolesService.getFormMode().CREATE;
    this.createForm();
    this.modalRef = this.modalService.open(modal, {
      windowClass: 'search',
      backdrop: false
    });
  }

  onViewRow(event: any, Roles: any, viewRole?: string) {
    // this.getPermission();
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
      vggroleName: this.selectedRow.vggroleName
    });
    this.modalRef = this.modalService.open(Roles, {
      windowClass: 'search',
      backdrop: false
    });
  }

  createForm(formMode: any = null) {
    const isDisabled = formMode === 'VIEW' ? true : false;

    this.rolesForm = this.formBuilder.group({
      name: [{ value: '', disabled: isDisabled }, [Validators.required]]
    });
  }
}
