import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateRemoteRepositoryCredentials } from '../../models/credentials/create-remote-repository-credentials.model';
import { RemoteRepositoryCredentials } from '../../models/credentials/remote-repository-credentials.model';
import { Page } from '../../models/page.model';

@Injectable({
  providedIn: 'root',
})
export class CredentialsRestApiService {
  private readonly baseUrl: string = `${environment.uboardApiUrl}/credentials`;

  constructor(private httpClient: HttpClient) {}

  listCredentialsAsPage(
    page: number,
    size: number
  ): Observable<Page<RemoteRepositoryCredentials>> {
    return this.httpClient.get<Page<RemoteRepositoryCredentials>>(
      `${this.baseUrl}?page=${page}&size=${size}`
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
