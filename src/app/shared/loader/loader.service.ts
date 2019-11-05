import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  isLoading: boolean = false;
  message: string;

  constructor() {}

  show(message = 'Please Wait') {
    this.message = message;
    this.isLoading = true;
  }

  hide() {
    this.isLoading = false;
    this.message = '';
  }
}
