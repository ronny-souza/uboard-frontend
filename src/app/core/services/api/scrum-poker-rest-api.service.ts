import { CreateScrumPokerRoomForm } from './../../models/scrum-poker-rooms/create-scrum-poker-room.model';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ScrumPokerVote } from '../../models/scrum-poker-rooms/scrum-poker-vote.model';
import { ScrumPokerRoomData } from '../../models/scrum-poker-rooms/srcum-poker-room-data.model';

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

  getScrumPokerRoom(roomId: string): Observable<ScrumPokerRoomData> {
    return this.httpClient.get<ScrumPokerRoomData>(
      `${this.baseUrl}/room/${roomId}`
    );
  }

  createScrumPokerRoom(
    body: CreateScrumPokerRoomForm
  ): Observable<ScrumPokerRoomData> {
    return this.httpClient.post<ScrumPokerRoomData>(
      `${this.baseUrl}/room`,
      body
    );
  }
}
