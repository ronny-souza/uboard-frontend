import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import { BehaviorSubject } from 'rxjs';
import { ScrumPokerVote } from '../../models/scrum-poker-rooms/scrum-poker-vote.model';
import { environment } from '../../../../environments/environment';
import { ScrumPokerRestApiService } from '../api/scrum-poker-rest-api.service';
import { ScrumPokerRoomState } from '../../models/scrum-poker-rooms/scrum-poker-room-state.model';

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

  private roomVotesVisibilitySubject = new BehaviorSubject<boolean>(false);
  roomVotesVisibility$ = this.roomVotesVisibilitySubject.asObservable();

  private scrumPokerRoomClosedStateSubject =
    new BehaviorSubject<ScrumPokerRoomState>({ roomId: '', closed: false });
  scrumPokerRoomClosedState$ =
    this.scrumPokerRoomClosedStateSubject.asObservable();

  constructor(private scrumPokerRestApiService: ScrumPokerRestApiService) {}

  connect(userIdentifier: string, username: string, roomId: string): void {
    this.scrumPokerRestApiService
      .listRoomVotes(roomId)
      .subscribe((currentVotes) => {
        this.votesSubject.next(currentVotes);

        this.stompClient = new Client({
          brokerURL: this.webSocketUrl,
        });

        this.stompClient.onConnect = () => {
          this.publishScrumPokerRoomUserVoteEvent(
            userIdentifier,
            username,
            roomId,
            null
          );
          this.onAddRoomVotesListener(roomId);
          this.onUserLeftScrumPokerRoomListener(roomId);
          this.onAddRoomVotesVisibilityListener(roomId);
          this.onScrumPokerClosedStateChangeListener(roomId);
        };

        this.stompClient.activate();
      });
  }

  publishScrumPokerRoomUserVoteEvent(
    userIdentifier: string,
    username: string,
    roomIdentifier: string,
    vote: string | null
  ) {
    if (this.stompClient && this.stompClient.connected) {
      const payload = { userIdentifier, username, roomIdentifier, vote };
      this.stompClient.publish({
        destination: `${this.webSocketAppPrefix}${this.webSocketEndpointPrefix}/${roomIdentifier}/vote`,
        body: JSON.stringify(payload),
      });
    }
  }

  publishScrumPokerRoomVotesVisibilityChangeEvent(
    roomIdentifier: string,
    isRoomVotesVisible: boolean
  ) {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({
        destination: `${this.webSocketAppPrefix}${this.webSocketEndpointPrefix}/${roomIdentifier}/toggle-votes`,
        body: JSON.stringify(isRoomVotesVisible),
      });
    }
  }

  publishScrumPokerRoomUserDisconnectEvent(
    roomIdentifier: string,
    userIdentifier: string
  ) {
    return this.stompClient.publish({
      destination: `${this.webSocketAppPrefix}${this.webSocketEndpointPrefix}/${roomIdentifier}/user/${userIdentifier}`,
    });
  }

  publishCloseScrumPokerRoomEvent(
    roomIdentifier: string,
    userIdentifier: string
  ) {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({
        destination: `${this.webSocketAppPrefix}${this.webSocketEndpointPrefix}/${roomIdentifier}/close`,
        body: userIdentifier,
      });
    }
  }

  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.deactivate();
    }
  }

  private onUserLeftScrumPokerRoomListener(roomId: string) {
    this.stompClient.subscribe(
      `${this.webSocketEndpointPrefix}/${roomId}/user-left`,
      (message) => {
        this.scrumPokerRestApiService
          .listRoomVotes(roomId)
          .subscribe((currentVotes) => {
            this.votesSubject.next(currentVotes);
          });
      }
    );
  }

  private onAddRoomVotesListener(roomId: string) {
    this.stompClient.subscribe(
      `${this.webSocketEndpointPrefix}/${roomId}/votes`,
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
  }

  private onAddRoomVotesVisibilityListener(roomId: string) {
    this.stompClient.subscribe(
      `${this.webSocketEndpointPrefix}/${roomId}/votes-visibility`,
      (message) => {
        const isRoomVotesVisible: boolean = JSON.parse(message.body);
        this.roomVotesVisibilitySubject.next(isRoomVotesVisible);
      }
    );
  }

  private onScrumPokerClosedStateChangeListener(roomId: string) {
    this.stompClient.subscribe(
      `${this.webSocketEndpointPrefix}/${roomId}/is-closed`,
      (message) => {
        const isRoomClosed: boolean = JSON.parse(message.body);
        this.scrumPokerRoomClosedStateSubject.next({
          roomId: roomId,
          closed: isRoomClosed,
        });
      }
    );
  }
}
