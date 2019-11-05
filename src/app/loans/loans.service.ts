import { Injectable } from '@angular/core';
import { BaseService } from '@app/core/base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const routes = {
  approvalList: 'Loan/approvallist',
  loanApproval: 'Loan/loanapproval',
  pendingdisbursements: 'Loan/getuserloans',
  // pendingdisbursements : 'Loan/pendingdisbursements',
  disburseloan: 'Loan/disburseloan/'
};

export interface IApprovalList {
  approvalStatus: number;
  id: number;
  isDisbursed: boolean;
  isLiquidated: boolean;
  loanAmount: number;
  productId: number;
  productName: string;
  tenantId: string;
  tenor: number;
}

export interface IApproval {
  loanId: number;
  approvalStatus: number;
}

@Injectable({
  providedIn: 'root'
})
export class LoansService extends BaseService<any> {
  constructor(public http: HttpClient) {
    super(http);
  }

  getApprovalList(): Observable<any> {
    return this.sendGet(this.baseUrl(routes.approvalList), true);
  }

  pendingDisbursements(): Observable<any> {
    return this.sendGet(this.baseUrl(routes.pendingdisbursements), true);
  }

  approveLoan(payload: IApproval): Observable<any> {
    return this.sendPost(this.baseUrl(routes.loanApproval), payload);
  }

  disburseloan(id: number): Observable<any> {
    return this.sendPost(this.baseUrl(routes.disburseloan + id), {});
  }
}
