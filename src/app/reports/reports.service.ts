import { Injectable } from '@angular/core';
import { BaseService } from '@app/core/base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const routes = {
  loantransactionreport: 'Report/loantransactionreport',
  exportloantransactionreport: 'Report/exportloantransactionreport',
  loanreport: 'Report/loanreport',
  exportloanreport: 'Report/exportloanreport'
};

export interface IReport {
  startDate: string;
  endDate: string;
  transactionType?: 1;
  transactionReference?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReportsService extends BaseService<any> {
  constructor(public http: HttpClient) {
    super(http);
  }

  loanTransactionReport(payload: IReport): Observable<any> {
    return this.sendPost(this.baseUrl(routes.loantransactionreport), payload);
  }
  exportLoanTransactionReport(payload: IReport): Observable<any> {
    return this.sendPost(this.baseUrl(routes.exportloantransactionreport), payload);
  }
  loanReport(payload: IReport): Observable<any> {
    return this.sendPost(this.baseUrl(routes.loanreport), payload);
  }
  exportLoanReport(payload: IReport): Observable<any> {
    return this.sendPost(this.baseUrl(routes.exportloanreport), payload);
  }
}
