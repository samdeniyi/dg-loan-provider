import { Injectable } from '@angular/core';
import { BaseService } from '@app/core/base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const routes = {
  getroles: 'Role/getroles',
  createrole: 'Role/createrole',
  updaterole: 'Role/updaterole',
  getrolebyid: 'Role/getrolebyid',
  deleteRole: 'Role/deleteRole',
  managerolepermission: 'Role/managerolepermission',
  getrolepermissions: 'Role/getrolepermissions'
};

export interface IRole {
  name: string;
  tenantId: string;
  id?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RolesService extends BaseService<any> {
  constructor(public http: HttpClient) {
    super(http);
  }

  getroles(): Observable<any> {
    return this.sendGet(this.baseUrl(routes.getroles));
  }
  getrolepermissions(): Observable<any> {
    return this.sendGet(this.baseUrl(routes.getrolepermissions));
  }
  createrole(payload: IRole): Observable<any> {
    return this.sendPost(this.baseUrl(routes.createrole), payload);
  }
  managerolepermission(payload: IRole): Observable<any> {
    return this.sendPost(this.baseUrl(routes.managerolepermission), payload);
  }
  updaterole(payload: IRole): Observable<any> {
    return this.sendPost(this.baseUrl(routes.updaterole), payload);
  }

  deleteRole(id: number): Observable<any> {
    return this.sendDelete(this.baseUrl(`${routes.deleteRole}/${id}`));
  }

  getrolebyid(id: number): Observable<any> {
    return this.sendGet(this.baseUrl(`${routes.getrolebyid}/${id}`));
  }
}
