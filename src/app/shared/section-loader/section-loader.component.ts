import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-section-loader',
  templateUrl: './section-loader.component.html',
  styleUrls: ['./section-loader.component.scss']
})
export class SectionLoaderComponent implements OnInit {
  @Input() isLoading = false;
  message: string = 'Please wait';

  constructor() {}

  ngOnInit() {}
}
