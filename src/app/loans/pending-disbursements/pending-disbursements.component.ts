import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {LoansService} from '@app/loans/loans.service';
import {ToastrService} from 'ngx-toastr';
import {finalize} from 'rxjs/operators';
import {untilDestroyed} from '@app/core/until-destroyed';
import {Logger} from '@app/core/logger.service';

const log = new Logger('Pending Disbursement');

@Component({
  selector: 'app-pending-disbursements',
  templateUrl: './pending-disbursements.component.html',
  styleUrls: ['./pending-disbursements.component.scss']
})
export class PendingDisbursementsComponent implements OnInit, OnDestroy {
  pendingListObj: any;
  title = 'Pending Disbursement';
  isLoading = false;
  breadcrumbItem = [
    {
      title: 'Loans',
      cssClass: ''
    },
    {
      title: 'Pending disbursement',
      cssClass: 'active'
    }
  ];

  constructor(private loanService: LoansService, private toastr: ToastrService, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.getPendingList();
  }

  ngOnDestroy(): void {
  }

  getPendingList() {
    const panding$ = this.loanService.pendingDisbursements();
    panding$.pipe(
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
            this.pendingListObj = res.responseData.filter((m: any) => m.approvalStatus === 1);
            this.toastr.success(res.message, undefined, {
              closeButton: true,
              positionClass: 'toast-top-right'
            });
            this.cd.markForCheck();
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

  onDisburse(id: number){
      const disburse$ = this.loanService.disburseloan(id);
    disburse$.pipe(
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
            this.getPendingList();
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
