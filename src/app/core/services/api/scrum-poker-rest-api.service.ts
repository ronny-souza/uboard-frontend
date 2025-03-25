import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { from, Observable, switchMap } from 'rxjs';
import { ScrumPokerVote } from '../../models/scrum-poker-rooms/scrum-poker-vote.model';
import { ScrumPokerRoomData } from '../../models/scrum-poker-rooms/srcum-poker-room-data.model';
import { UboardKeycloakService } from '../uboard-keycloak.service';

@Injectable({
  providedIn: 'root',
})
export class ScrumPokerRestApiService {
  private readonly baseUrl: string = `${environment.uboardApiUrl}/scrum-poker`;

  constructor(
    private httpClient: HttpClient,
    private uboardKeycloakService: UboardKeycloakService
  ) {}

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

  createScrumPokerRoom(name: string): Observable<ScrumPokerRoomData> {
    return from(this.uboardKeycloakService.getSessionUser()).pipe(
      switchMap((user) => {
        const body = {
          name,
          userIdentifier: user.id,
        };
        return this.httpClient.post<ScrumPokerRoomData>(
          `${this.baseUrl}/room`,
          body
        );
      })
    );
  }

  deleteScrumPokerRoomUser(roomIdentifier: string, userIdentifier: string) {
    return this.httpClient.delete(
      `${this.baseUrl}/room/${roomIdentifier}/user/${userIdentifier}`
    );
  }
}
