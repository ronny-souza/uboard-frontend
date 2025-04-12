import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserRestApiService {
  private readonly baseUrl: string = `${environment.uboardApiUrl}/users`;

  constructor(private httpClient: HttpClient) {}

  syncUser() {
    this.httpClient.get<void>(`${this.baseUrl}/sync`).subscribe({
      error: (err) => console.error('Erro ao sincronizar usuário', err),
    });
  }
}
