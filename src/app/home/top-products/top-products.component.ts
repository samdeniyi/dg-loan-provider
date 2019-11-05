import { Component, OnInit, OnDestroy } from '@angular/core';
declare var require: any;
import EChartOption = echarts.EChartOption;
import { LoaderService } from '@app/shared/loader/loader.service';
import { LoanProductsService } from '@app/loan-products/loan-products.service';
import { finalize, take, map } from 'rxjs/operators';
import { untilDestroyed } from '@app/core/until-destroyed';
import { Logger } from '@app/core/logger.service';
import { ToastrService } from 'ngx-toastr';
import { pick } from '@app/helper';

const log = new Logger('List Product');
@Component({
  selector: 'app-top-products',
  templateUrl: './top-products.component.html',
  styleUrls: ['./top-products.component.scss']
})
export class TopProductsComponent implements OnInit, OnDestroy {
  public stackedBarChart: EChartOption = {};
  public productListObj: any[];

  constructor(
    private productService: LoanProductsService,
    private loaderService: LoaderService,
    private toastr: ToastrService
  ) {
    this.stackedBarChart = this.getTopProductChartOptions();
  }

  ngOnInit() {
    this.getCreatedLoanProducts();
  }

  ngOnDestroy() {}

  getTopProductChartOptions() {
    const options: EChartOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        // data: ['Mobile', 'Laptop', 'Computer'],
        data: ['OgaLoan', 'StuCredit', 'EmpLoan'],
        right: '4%'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: ['W1', 'W2', 'W3', 'W4', 'W5'],
          axisLine: {
            show: false
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          minInterval: 2500,
          splitLine: {
            lineStyle: {
              type: 'dotted'
            }
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            formatter: function(value: any, index: any) {
              if (value > 0) {
                return value / 1000 + ' K';
              } else {
                return 0;
              }
            }
          }
        }
      ],
      series: [
        {
          name: 'OgaLoan',
          type: 'bar',
          stack: 'Gedgets',
          data: [2350, 3205, 4520, 2351, 5632],
          itemStyle: {
            color: '#6ebdd1'
          },
          barWidth: '40px'
        },
        {
          name: 'StuCredit',
          type: 'bar',
          stack: 'Gedgets',
          data: [2341, 2583, 1592, 2674, 2323],
          itemStyle: {
            color: '#f9ab6c'
          },
          barWidth: '40px'
        },
        {
          name: 'EmpLoan',
          type: 'bar',
          stack: 'Gedgets',
          data: [1212, 5214, 2325, 4235, 2519],
          itemStyle: {
            color: '#afc979'
          },
          barWidth: '40px'
        }
      ]
    };

    return options;
  }

  getCreatedLoanProducts() {
    this.loaderService.show();
    const loanProduct$ = this.productService.getCreatedLoanProducts();
    loanProduct$
      .pipe(
        finalize(() => {
          this.loaderService.hide();
        }),
        untilDestroyed(this)
      )
      .subscribe(
        (res: any) => {
          log.info(`product list response: ${res}`);
          if (res.responseCode === '00') {
            this.productListObj = pick(res.responseData, 5);
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
