import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoanProductsService } from '@app/loan-products/loan-products.service';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Logger } from '@app/core/logger.service';
import { untilDestroyed } from '@app/core/until-destroyed';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';

const log = new Logger('List Product');

@Component({
  selector: 'app-list-products',
  templateUrl: './list-products.component.html',
  styleUrls: ['./list-products.component.scss']
})
export class ListProductsComponent implements OnInit, OnDestroy {
  public isLoading = false;
  public breadcrumbItem: any = [
    {
      title: 'Loan Products',
      cssClass: ''
    },
    {
      title: 'View loan product',
      cssClass: 'active'
    }
  ];
  public title = 'Create Loan Product';
  public productListObj: any;

  modalRef: NgbModalRef;
  selectedTrans: any;

  constructor(
    private productService: LoanProductsService,
    private toastr: ToastrService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.getCreatedLoanProducts();
  }

  ngOnDestroy(): void {}

  getCreatedLoanProducts() {
    const loanProduct$ = this.productService.getCreatedLoanProducts();
    loanProduct$
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
            this.productListObj = res.responseData;
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

  onViewModal(view: any, transaction: any) {
    this.selectedTrans = transaction;
    console.log(this.selectedTrans);
    this.modalRef = this.modalService.open(view, {
      windowClass: 'search medium',
      backdrop: true
    });
  }

  closeModel(t?: any) {
    this.selectedTrans = null;
    this.modalRef.close();
  }
}
