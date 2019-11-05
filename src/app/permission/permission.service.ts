import { Injectable } from '@angular/core';
import { BaseService } from '@app/core/base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const routes = {
  getpermissions: 'permission/getpermissions',
  createpermission: 'permission/createpermission',
  updatepermission: 'permission/updatepermission',
  getpermissionbyid: 'permission/getpermissionbyid',
  deletepermission: 'permission/deletepermission'
};

export interface Ipermission {
  name: string;
  tenantId: string;
  id?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PermissionService extends BaseService<any> {
  constructor(public http: HttpClient) {
    super(http);
  }

  getpermissions(): Observable<any> {
    return this.sendGet(this.baseUrl(routes.getpermissions));
  }

  createpermission(payload: Ipermission): Observable<any> {
    return this.sendPost(this.baseUrl(routes.createpermission), payload);
  }

  updatepermission(payload: Ipermission): Observable<any> {
    return this.sendPost(this.baseUrl(routes.updatepermission), payload);
  }

  deletepermission(data: any): Observable<any> {
    return this.sendPost(this.baseUrl(`${routes.deletepermission}`), data);
  }

  getpermissionbyid(id: number): Observable<any> {
    return this.sendGet(this.baseUrl(`${routes.getpermissionbyid}/${id}`));
  }
}
