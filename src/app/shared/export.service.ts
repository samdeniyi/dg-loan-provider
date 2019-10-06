import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  constructor() {}

  public export(transactionData: any, exportFileName = '') {
    if (transactionData.length === 0) return;

    const todayDate = new Date(Date.now());
    const year = todayDate.getFullYear();
    const month = todayDate.getMonth();
    const day = todayDate.getDate();
    const hour = todayDate.getHours();
    const seconds = todayDate.getSeconds();

    const fileName = `${exportFileName}_${year}${month}${day}${hour}${seconds}`;

    console.log(transactionData);

    const arrDay = transactionData.map((data: any) => {
      return Array.from(Object.keys(data), key => data[key]);
    });
    const header = Object.keys(transactionData[0]);
    arrDay.unshift(header.map((str: string) => this.properCase(this.unCamelCase(str))));

    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(arrDay);
    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Pending Transactions');

    /* save to file */
    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }

  /**
   * Add space between camelCase text.
   */
  private unCamelCase(str: string) {
    str = str.replace(/([a-z\xE0-\xFF])([A-Z\xC0\xDF])/g, '$1 $2');
    str = str.toLowerCase(); // add space between camelCase text
    return str;
  }

  /**
   * UPPERCASE first char of each word.
   */
  private properCase(str: string) {
    return this.lowerCase(str).replace(/^\w|\s\w/g, this.upperCase);
  }

  /**
   * "Safer" String.toLowerCase()
   */
  public lowerCase(str: string) {
    return str.toLowerCase();
  }

  /**
   * "Safer" String.toUpperCase()
   */
  public upperCase(str: string) {
    return str.toUpperCase();
  }
}
