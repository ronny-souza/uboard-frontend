import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateRemoteRepositoryCredentials } from '../../models/credentials/create-remote-repository-credentials.model';
import { RemoteRepositoryCredentials } from '../../models/credentials/remote-repository-credentials.model';
import { Page } from '../../models/page.model';
import { CredentialsFilter } from '../../models/credentials/credentials-filter.model';

@Injectable({
  providedIn: 'root',
})
export class CredentialsRestApiService {
  private readonly baseUrl: string = `${environment.uboardApiUrl}/credentials`;

  constructor(private httpClient: HttpClient) {}

  listCredentialsAsPage(
    page: number,
    size: number,
    filters: CredentialsFilter = {}
  ): Observable<Page<RemoteRepositoryCredentials>> {
    let params = new HttpParams().set('page', page).set('size', size);

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params = params.set(key, value.toString());
      }
    });

    return this.httpClient.get<Page<RemoteRepositoryCredentials>>(
      this.baseUrl,
      { params }
    );
  }

  createRepositoryCredentials(
    body: CreateRemoteRepositoryCredentials
  ): Observable<RemoteRepositoryCredentials> {
    return this.httpClient.post<RemoteRepositoryCredentials>(
      this.baseUrl,
      body
    );
  }
}
