import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import { BehaviorSubject } from 'rxjs';
import { ScrumPokerVote } from '../../models/scrum-poker-rooms/scrum-poker-vote.model';
import { environment } from '../../../../environments/environment';
import { ScrumPokerRestApiService } from '../api/scrum-poker-rest-api.service';

@Injectable({
  providedIn: 'root',
})
export class ScrumPokerRoomWebSocketService {
  private webSocketAppPrefix = '/app';
  private webSocketEndpointPrefix = '/poker-room';
  private webSocketUrl: string = environment.webSocketUrl;
  private stompClient!: Client;
  private votesSubject = new BehaviorSubject<ScrumPokerVote[]>([]);
  votes$ = this.votesSubject.asObservable();

  constructor(private scrumPokerRestApiService: ScrumPokerRestApiService) {}

  connect(userIdentifier: string, username: string, roomId: string): void {
    this.scrumPokerRestApiService.listRoomVotes(roomId).subscribe((currentVotes) => {
        this.votesSubject.next(currentVotes);

        this.stompClient = new Client({
          brokerURL: this.webSocketUrl,
        });

        this.stompClient.onConnect = () => {
          this.publishUserVote(userIdentifier, username, roomId, null);

          this.stompClient.subscribe(`${this.webSocketEndpointPrefix}/${roomId}/votes`,
            (message) => {
              const newVote: ScrumPokerVote = JSON.parse(message.body);

              const existingVotes = this.votesSubject.value;
              const existingVoteIndex = existingVotes.findIndex(
                (vote) => vote.userIdentifier === newVote.userIdentifier
              );

              if (existingVoteIndex !== -1) {
                existingVotes[existingVoteIndex] = newVote;
              } else {
                existingVotes.push(newVote);
              }

              this.votesSubject.next([...existingVotes]);
            }
          );
        };

        this.stompClient.activate();
      });
  }

  publishUserVote(userIdentifier: string, username: string, roomIdentifier: string, vote: string | null) {
    if (this.stompClient && this.stompClient.connected) {
      const payload = { userIdentifier, username, roomIdentifier, vote };
      this.stompClient.publish({
        destination: `${this.webSocketAppPrefix}${this.webSocketEndpointPrefix}/${roomIdentifier}/vote`,
        body: JSON.stringify(payload),
      });
    }
  }

  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
    }
  }
}
