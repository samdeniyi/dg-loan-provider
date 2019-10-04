import { Component, OnInit } from '@angular/core';

import EChartOption = echarts.EChartOption;
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Logger } from '@app/core/logger.service';
import { ReportsService } from './reports.service';
import { finalize, map, filter, toArray } from 'rxjs/operators';
import { Observable, range } from 'rxjs';

import { ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
// import * as pluginDataLabels from 'chartjs-plugin-datalabels';

const log = new Logger('home');

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  isLoading = false;
  loanTransactionReports: any[] = [];

  public sidebarVisible = true;
  public title = 'Reports';
  public breadcrumbItem: any = [
    {
      title: 'Reports',
      cssClass: 'active'
    }
  ];

  // Pagination
  offset = 10;
  limit = 1;
  size: number;
  currentPage: number;
  totalPages: number;
  range = 3;
  pages: Observable<number[]>;

  public pieChartOptions = {
    responsive: true,
    legend: {
      position: 'top'
    },
    plugins: {
      datalabels: {
        formatter: (value: any, ctx: any) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        }
      }
    }
  };
  public pieChartLabels: Label[] = [['Download', 'Sales'], ['In', 'Store', 'Sales'], 'Mail Sales'];
  public pieChartData: number[] = [300, 500, 100];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  // public pieChartPlugins = [ pluginDataLabels ];
  public pieChartColors = [
    {
      backgroundColor: ['rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)']
    }
  ];

  constructor(private reportsService: ReportsService) {}

  ngOnInit() {
    this.getLoanTransactionReport();
    // this.getPages(this.offset, this.limit, this.size);
  }

  ngOnChanges() {
    this.getPages(this.offset, this.limit, this.size);
  }

  getLoanTransactionReport() {
    this.isLoading = true;

    const dates = {
      startDate: '01-08-2019',
      endDate: '2019-08-01'
    };

    this.reportsService
      .loanTransactionReport(dates)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (res: any) => {
          if (res.responseCode === '00') {
            this.loanTransactionReports = res.responseData;
            console.log(res.responseData);
            this.size = this.loanTransactionReports.length;
            this.getPages(this.offset, this.limit, this.size);
          } else {
            console.error(res.message);
          }
        },
        (error: any) => {
          console.error(error);
        }
      );
  }

  transStatus(status: any) {
    if (status == null) return;
    if (status === 'Processing') return { processing: true };
    if (status === 'Successful') return { successful: true };
    if (status === 'Failed') return { failed: true };
  }

  // Pagination

  getPages(offset: number, limit: number, size: number) {
    this.currentPage = this.getCurrentPage(offset, limit);
    this.totalPages = this.getTotalPages(limit, size);
    console.log(this.currentPage, this.totalPages);
    this.pages = range(-this.range, this.range * 2 + 1).pipe(
      map(offset => this.currentPage + offset),
      filter(page => this.isValidPageNumber(page, this.totalPages)),
      toArray()
    );
  }

  isValidPageNumber(page: number, totalPages: number): boolean {
    return page > 0 && page <= totalPages;
  }

  getCurrentPage(offset: number, limit: number): number {
    return Math.floor(offset / limit) + 1;
  }

  getTotalPages(limit: number, size: number): number {
    return Math.ceil(Math.max(size, 1) / Math.max(limit, 1));
  }

  selectPage(page: number, event: any) {
    event.preventDefault();
    let newPage;
    if (this.isValidPageNumber(page, this.totalPages)) {
      newPage = (page - 1) * this.limit;
    }
    console.log('newPage', newPage);
  }

  cancelEvent(event: any) {
    event.preventDefault();
  }
}
