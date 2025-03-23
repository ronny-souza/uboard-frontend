import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ScrumPokerVote } from '../../models/scrum-poker-vote.model';

@Injectable({
  providedIn: 'root',
})
export class ScrumPokerRestApiService {
  private readonly baseUrl: string = `${environment.uboardApiUrl}/scrum-poker`;

  constructor(private httpClient: HttpClient) {}

  listRoomVotes(roomId: string): Observable<ScrumPokerVote[]> {
    return this.httpClient.get<ScrumPokerVote[]>(
      `${this.baseUrl}/room/${roomId}/votes`
    );
  }
}
