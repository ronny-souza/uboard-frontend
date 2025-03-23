import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import { BehaviorSubject } from 'rxjs';
import { ScrumPokerVote } from '../models/scrum-poker-vote.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ScrumPokerService {
  private stompClient!: Client;
  private votesSubject = new BehaviorSubject<ScrumPokerVote[]>([]);
  votes$ = this.votesSubject.asObservable();
  webSocketEndpoint: string = 'ws://localhost:8080/ws';

  constructor(private httpClient: HttpClient) {}

  connect(userIdentifier: string, username: string, roomId: string): void {
    this.httpClient
      .get<ScrumPokerVote[]>(
        `http://localhost:8080/scrum-poker/room/${roomId}/votes`
      )
      .subscribe((currentVotes) => {
        this.votesSubject.next(currentVotes);

        this.stompClient = new Client({
          brokerURL: this.webSocketEndpoint,
        });

        this.stompClient.onConnect = () => {
          this.sendVote(userIdentifier, username, roomId, null);

          this.stompClient.subscribe(
            `/poker-room/${roomId}/votes`,
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

  sendVote(
    userIdentifier: string,
    username: string,
    roomIdentifier: string,
    vote: string | null
  ): void {
    if (this.stompClient && this.stompClient.connected) {
      const payload = { userIdentifier, username, roomIdentifier, vote };
      this.stompClient.publish({
        destination: `/app/poker-room/${roomIdentifier}/vote`,
        body: JSON.stringify(payload),
      });
    }
  }

  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
      console.log('Desconectado do WebSocket');
    }
  }
}
