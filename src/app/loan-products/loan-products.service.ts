import { Injectable } from '@angular/core';
import { BaseService } from '@app/core/base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface IProductDetail {
  name: string;
  description: string;
  minLoanAmount: number;
  maxLoanAmount: number;
  minTenor: number;
  maxTenor: number;
  interestRate: number;
  rateType: number;
  loanType: number;
  penalty: number;
  isBVNRequired: boolean;
}

export interface IProductRequiredFields {
  formFieldId: number;
  isRequired: true;
}

export interface ILoanProduct {
  product: IProductDetail;
  productFormFields: Array<IProductRequiredFields>;
}

const routes = {
  getformfields: 'FormField/getformfields',
  createProduct: 'Product/createproduct',
  getAllProducts: 'Product/GetAllProducts',
  getProduct: 'Product/getproducttoeditbyid',
  editProduct: 'Product/editproduct'
};

@Injectable({
  providedIn: 'root'
})
export class LoanProductsService extends BaseService<ILoanProduct> {
  constructor(public http: HttpClient) {
    super(http);
  }

  getRequiredFormFields(): Observable<any> {
    return this.sendGet(this.baseUrl(routes.getformfields));
  }

  createLoanProduct(payload: ILoanProduct): Observable<any> {
    return this.sendPost(this.baseUrl(routes.createProduct), payload);
  }

  getCreatedLoanProducts(): Observable<any> {
    return this.sendGet(this.baseUrl(routes.getAllProducts));
  }

  getEditLoanProduct(id: any): Observable<any> {
    return this.sendGet(this.baseUrl(`${routes.getProduct}/${id}`));
  }

  updateLoanProduct(payload: ILoanProduct): Observable<any> {
    return this.sendPost(this.baseUrl(routes.editProduct), payload);
  }
}
