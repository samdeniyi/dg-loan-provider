import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {IApproval, IApprovalList, LoansService} from '@app/loans/loans.service';
import {ToastrService} from 'ngx-toastr';
import {finalize} from 'rxjs/operators';
import {untilDestroyed} from '@app/core/until-destroyed';
import {Logger} from '@app/core/logger.service';

const log = new Logger('Approval list');

@Component({
  selector: 'app-approval-list',
  templateUrl: './approval-list.component.html',
  styleUrls: ['./approval-list.component.scss']
})
export class ApprovalListComponent implements OnInit, OnDestroy {

  approvalListObj: any;
  title = 'Approval List';
  isLoading = false;
  breadcrumbItem = [
    {
      title: 'Loans',
      cssClass: ''
    },
    {
      title: 'Approval list',
      cssClass: 'active'
    }
  ];

  constructor(private loanService: LoansService, private toastr: ToastrService, private cd: ChangeDetectorRef) {

  }

  ngOnInit() {
    this.getApprovalList();
  }



  ngOnDestroy(): void {
  }

  getApprovalList() {
    const list$ = this.loanService.getApprovalList();
    list$
      .pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        untilDestroyed(this)
      )
      .subscribe(
        (res: any) => {
          log.info(`product list response: ${res}`);
          if (res.responseCode === '00') {
            this.approvalListObj = res.responseData;
            log.info(this.approvalListObj);
            this.cd.markForCheck();
            this.toastr.success(res.message, undefined, {
              closeButton: true,
              positionClass: 'toast-top-right'
            });
          } else {
            this.toastr.error(res.message, undefined, {
              closeButton: true,
              positionClass: 'toast-top-right'
            });
          }
        },
        err => {
          log.error(`userRegistration error: ${err}`);
        }
      );
  }

  onApprove(id: any) {
      const payload: IApproval = {
      loanId: id,
      approvalStatus: 1
    };
    const  approve$ = this.loanService.approveLoan(payload);
    approve$.pipe(
        finalize(() => {
          this.isLoading = false;
        }),
        untilDestroyed(this)
      )
      .subscribe(
        (res: any) => {
          log.info(`product list response: ${res}`);
          if (res.responseCode === '00') {
            log.info(res.responseData);
            this.toastr.success(res.message, undefined, {
              closeButton: true,
              positionClass: 'toast-top-right'
            });
            this.getApprovalList();
          } else {
            this.toastr.error(res.message, undefined, {
              closeButton: true,
              positionClass: 'toast-top-right'
            });
          }
        },
        err => {
          log.error(`userRegistration error: ${err}`);
        }
      );
  }
}
