import { Component, OnInit } from '@angular/core';

import EChartOption = echarts.EChartOption;
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { Logger } from '@app/core/logger.service';

const log = new Logger('home');

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  isLoading = false;

  public sidebarVisible = true;
  public title = 'Reports';
  public breadcrumbItem: any = [
    {
      title: 'Reports',
      cssClass: 'active'
    }
  ];

  constructor() {}

  ngOnInit() {}
}
