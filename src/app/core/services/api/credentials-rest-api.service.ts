import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateCredentialModel } from '../../models/credentials/create-credential.model';
import { CredentialModel } from '../../models/credentials/credential.model';
import { Page } from '../../models/page.model';
import { CredentialFilterModel } from '../../models/credentials/credential-filter.model';
import { CredentialTargetModel } from '../../models/credentials/credential-target.model';

@Injectable({
  providedIn: 'root',
})
export class CredentialsRestApiService {
  private readonly baseUrl: string = `${environment.uboardApiUrl}/credentials`;

  constructor(private httpClient: HttpClient) {}

  listCredentialsAsPage(
    page: number,
    size: number,
    filters: CredentialFilterModel = {}
  ): Observable<Page<CredentialModel>> {
    let params = new HttpParams().set('page', page).set('size', size);

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params = params.set(key, value.toString());
      }
    });

    return this.httpClient.get<Page<CredentialModel>>(this.baseUrl, { params });
  }

  listCredentialProjects(uuid: string): Observable<CredentialTargetModel[]> {
    const url = `${this.baseUrl}/${uuid}/projects`;
    return this.httpClient.get<CredentialTargetModel[]>(url);
  }

  listCredentialGroups(uuid: string): Observable<CredentialTargetModel[]> {
    const url = `${this.baseUrl}/${uuid}/groups`;
    return this.httpClient.get<CredentialTargetModel[]>(url);
  }

  createCredential(body: CreateCredentialModel): Observable<CredentialModel> {
    return this.httpClient.post<CredentialModel>(this.baseUrl, body);
  }
}
