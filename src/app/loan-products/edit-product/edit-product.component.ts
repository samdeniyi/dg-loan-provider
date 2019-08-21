import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  ILoanProduct,
  IProductDetail,
  IProductRequiredFields,
  LoanProductsService
} from '@app/loan-products/loan-products.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { Logger } from '@app/core/logger.service';
import { untilDestroyed } from '@app/core/until-destroyed';
import { LoaderService } from '@app/shared/loader/loader.service';

const log = new Logger('Create product');

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit, OnDestroy {
  public activeTab = '';
  public title = 'Edit Loan Product';
  public isLoading = false;
  public loanDetailObj: IProductDetail;
  public loanDetailForm: FormGroup;
  public createLoanProductObj: ILoanProduct;
  public showRequiredFields = false;
  public collepse = 'collapse0';
  public requiredFieldsArray = <any>[];
  public requiredFieldsObj: IProductRequiredFields;
  public tenorInWords: any;

  public rateType = [
    { key: '1', value: 'Days' },
    { key: '2', value: 'Weeks' },
    { key: '3', value: 'Months' },
    { key: '4', value: 'Years' }
  ];

  public loanType = [{ key: '1', value: 'Secured' }, { key: '2', value: 'Unsecured' }];

  public breadcrumbItem: any = [
    {
      title: 'Loan Products',
      cssClass: ''
    },
    {
      title: 'Edit loan product',
      cssClass: 'active'
    }
  ];
  constructor(
    public fb: FormBuilder,
    public productService: LoanProductsService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private loaderService: LoaderService
  ) {
    this.getAllFormFiields();
  }

  ngOnInit() {
    this.createLoanDetailForm();

    this.route.params.subscribe(res => {
      console.log(res);
      if (res.id) {
        this.getProduct(res.id);
      }
    });
  }

  ngOnDestroy(): void {}

  tabChange(title: string) {
    if (this.activeTab !== title) {
      this.activeTab = title;
      if (this.activeTab === 'loanDetails') {
        this.showRequiredFields = false;
      } else {
        this.showRequiredFields = true;
      }
    }
  }

  createLoanDetailForm() {
    this.loanDetailForm = this.fb.group({
      name: [null, Validators.required],
      description: [null, Validators.required],
      minLoanAmount: [null, [Validators.required]],
      maxLoanAmount: [null, [Validators.required]],
      minTenor: [null, [Validators.required]],
      maxTenor: [null, [Validators.required]],
      interestRate: [null, Validators.required],
      rateType: [null, Validators.required],
      loanType: [null, Validators.required],
      penalty: [null, Validators.required],
      isBVNRequired: [null],
      dob: [null],
      phoneOnBvn: [null]
    });
  }

  onSubmit() {
    if (this.loanDetailForm.valid) {
      this.showRequiredFields = true;
      this.activeTab = 'requiredFields';
      log.info(this.loanDetailForm.value);
    } else {
      this.showRequiredFields = false;
      this.activeTab = 'loanDetails';
    }
  }

  toggleCollepseGeneral(collepse: string) {
    if (this.collepse !== collepse) {
      this.collepse = collepse;
    } else {
      this.collepse = '';
    }
  }

  getAllFormFiields() {
    this.loaderService.show();
    const requiredFields$ = this.productService.getRequiredFormFields();
    requiredFields$
      .pipe(
        finalize(() => {
          this.loaderService.hide();
          this.loanDetailForm.markAsPristine();
        }),
        untilDestroyed(this)
      )
      .subscribe(
        (res: any) => {
          if (res.responseCode === '00') {
            this.requiredFieldsObj = res.responseData;
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

  addFormField(event: any, val: any) {
    if (event.target.checked) {
      log.info('addFormField', val);
      this.requiredFieldsObj = {
        formFieldId: val.id,
        isRequired: true
      };
      this.requiredFieldsArray.push(this.requiredFieldsObj);
      log.info('requiredFieldsArray', this.requiredFieldsArray);
    }
  }

  buildCreateProductPayload() {
    return (this.createLoanProductObj = {
      product: this.loanDetailForm.value,
      productFormFields: this.requiredFieldsArray
    });
  }

  setProductLoanValue(product: any) {
    console.log('produnt', product);
    this.loanDetailForm.patchValue({
      name: product.name,
      description: product.description,
      minLoanAmount: product.minLoanAmount,
      maxLoanAmount: product.maxLoanAmount,
      minTenor: product.minTenor,
      maxTenor: product.maxTenor,
      interestRate: product.interestRate,
      rateType: product.rateType,
      loanType: product.loanType,
      penalty: product.penaltyRate,
      isBVNRequired: product.isBVNRequired,
      dob: product.dob ? product.dob : false,
      phoneOnBvn: product.phoneOnBvn ? product.phoneOnBvn : false
    });
  }

  getProduct(id: number) {
    this.loaderService.show();
    log.info('create product', this.buildCreateProductPayload());
    const getProduct$ = this.productService.getEditLoanProduct(id);
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

            this.setProductLoanValue(res.responseData.product);
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
  createProduct() {
    this.loaderService.show();
    log.info('create product', this.buildCreateProductPayload());
    const createProduct$ = this.productService.createLoanProduct(this.buildCreateProductPayload());
    createProduct$
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
            this.router.navigate(['/products/list']);
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

  setTenor(e: any) {
    // this.tenorInWords = this.rateType[0].value;
    log.info(e);
    const md = this.rateType.filter((m: any) => m.key === e);
    log.info(md[0].value);
    this.tenorInWords = md[0].value;
  }
}
