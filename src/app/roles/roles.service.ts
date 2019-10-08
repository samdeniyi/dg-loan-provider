import { Injectable } from '@angular/core';
import { BaseService } from '@app/core/base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const routes = {
  getroles: 'Role/getroles',
  createrole: 'Role/createrole',
  updaterole: 'Role/updaterole',
  getrolebyid: 'Role/getrolebyid'
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
  createrole(payload: IRole): Observable<any> {
    return this.sendPost(this.baseUrl(routes.createrole), payload);
  }
  updaterole(payload: IRole): Observable<any> {
    return this.sendPost(this.baseUrl(routes.updaterole), payload);
  }
  getrolebyid(id: number): Observable<any> {
    return this.sendGet(this.baseUrl(`${routes.getrolebyid}/${id}`));
  }
}
