import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdminUsersService } from '@app/admin-users/admin-users.service';
import { finalize } from 'rxjs/operators';
import { untilDestroyed } from '@app/core/until-destroyed';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.scss']
})
export class ListUsersComponent implements OnInit, OnDestroy {
  public title = 'View Users';
  public isLoading = false;
  public userObj: any;

  public breadcrumbItem: any = [
    {
      title: 'Users',
      cssClass: ''
    },
    {
      title: 'View users',
      cssClass: 'active'
    }
  ];
  modalRef: NgbModalRef;
  selectedUser: any;

  constructor(
    private adminUsersService: AdminUsersService,
    private toastr: ToastrService,
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit() {
    this.getAdminUser();
  }

  ngOnDestroy(): void {}

  getAdminUser(): any {
    const adminUsers$ = this.adminUsersService.getAdminUsers();
    adminUsers$
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        untilDestroyed(this)
      )
      .subscribe(
        (res: any) => {
          if (res.responseCode === '00') {
            this.userObj = res.responseData;
          } else {
          }
        },
        (err: any) => {}
      );
  }

  onViewModal(view: any, transaction: any) {
    this.selectedUser = transaction;
    console.log(this.selectedUser);
    this.modalRef = this.modalService.open(view, {
      windowClass: 'search medium',
      backdrop: true
    });
  }

  goto(id: number) {
    this.router.navigate(['/', 'admin-users', id]);
  }

  closeModel(t?: any) {
    this.selectedUser = null;
    this.modalRef.close();
  }
}
