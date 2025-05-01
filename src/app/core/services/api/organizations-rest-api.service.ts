import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page } from '../../models/page.model';
import { OrganizationFilter } from '../../models/organizations/organization-filter.model';
import { OrganizationModel } from '../../models/organizations/organization.model';
import { CreateOrganizationModel } from '../../models/organizations/create-organization.model';

@Injectable({
  providedIn: 'root',
})
export class OrganizationsRestApiService {
  private readonly baseUrl: string = `${environment.uboardApiUrl}/organizations`;

  constructor(private httpClient: HttpClient) {}

  listOrganizationsAsPage(
    page: number,
    size: number,
    filters: OrganizationFilter = {}
  ): Observable<Page<OrganizationModel>> {
    let params = new HttpParams().set('page', page).set('size', size);

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params = params.set(key, value.toString());
      }
    });

    return this.httpClient.get<Page<OrganizationModel>>(this.baseUrl, {
      params,
    });
  }

  createOrganization(
    body: CreateOrganizationModel
  ): Observable<OrganizationModel> {
    return this.httpClient.post<OrganizationModel>(this.baseUrl, body);
  }
}
