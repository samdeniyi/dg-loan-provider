import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminUsersService, IAdminUser } from '@app/admin-users/admin-users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Logger } from '@app/core/logger.service';
import { finalize } from 'rxjs/operators';
import { untilDestroyed } from '@app/core/until-destroyed';
import { LoaderService } from '@app/shared/loader/loader.service';

const log = new Logger('Admin-user/add-user');

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit, OnDestroy {
  public data: any = {};
  public userForm: FormGroup;

  public title = 'Edit User';
  public breadcrumbItem: any = [
    {
      title: 'Users',
      cssClass: ''
    },
    {
      title: 'Edit user',
      cssClass: 'active'
    }
  ];
  constructor(
    public fb: FormBuilder,
    public usersService: AdminUsersService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private loaderService: LoaderService
  ) {}

  ngOnInit() {
    this.createForm();

    this.route.params.subscribe(res => {
      console.log(res);
      if (res.id) {
        this.getUser(res.id);
      }
    });
  }

  ngOnDestroy(): void {}

  createForm() {
    this.userForm = this.fb.group({
      lastName: [null, Validators.required],
      email: [null, Validators.required],
      firstName: [null, Validators.required],
      phoneNumber: [null, Validators.required],
      roleId: [null, Validators.required]
    });
  }
  setUserValue(user: any) {
    this.userForm = this.fb.group({
      lastName: user.lastName,
      email: user.email,
      firstName: user.firstName,
      phoneNumber: user.phoneNumber,
      roleId: user.roleId
    });
  }

  getUser(id: number) {
    this.loaderService.show();
    const getProduct$ = this.usersService.getUser(id);
    getProduct$
      .pipe(
        finalize(() => {
          this.loaderService.hide();
        }),
        untilDestroyed(this)
      )
      .subscribe(
        (res: any) => {
          log.info(res);
          if (res.responseCode === '00') {
            this.toastr.success(res.message, undefined, {
              closeButton: true,
              positionClass: 'toast-top-right'
            });

            this.setUserValue(res.responseData);
            console.log(res);
          } else {
            this.toastr.error(res.message, undefined, {
              closeButton: true,
              positionClass: 'toast-top-right'
            });
          }
        },
        (err: any) => {
          log.info(err);
        }
      );
  }

  buildCreateUserPayload(formObj: any): IAdminUser {
    const payload: IAdminUser = {
      userName: null,
      email: formObj.email,
      firstName: formObj.firstName,
      lastName: formObj.lastName,
      inviteCode: null,
      isAdmin: true,
      isDisabled: false,
      phoneNumber: formObj.phoneNumber,
      roleId: formObj.roleId
    };
    return payload;
  }

  onSubmit() {
    this.loaderService.show();

    if (this.userForm.valid) {
      this.usersService
        .createAdminUser(this.buildCreateUserPayload(this.userForm.value))
        .pipe(
          finalize(() => {
            this.loaderService.hide();
          })
        )
        .subscribe(
          (res: any) => {
            log.info(res);
            this.toastr.success(res.message, undefined, {
              closeButton: true,
              positionClass: 'toast-top-right'
            });
            this.router.navigate([this.route.snapshot.queryParams.redirect || '/admin-users/view'], {
              replaceUrl: true
            });
          },
          (err: any) => {
            log.error(err);
          }
        );
    } else {
      log.debug(this.userForm.value);
    }
  }
}
