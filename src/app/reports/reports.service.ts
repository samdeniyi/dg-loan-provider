import { Injectable } from '@angular/core';
import { BaseService } from '@app/core/base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const routes = {
  loantransactionreport: 'Report/loantransactionreport'
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
}
