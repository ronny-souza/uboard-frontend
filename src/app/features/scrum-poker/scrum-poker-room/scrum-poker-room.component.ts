import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ScrumPokerRoomWebSocketService } from '../../../core/services/websocket/scrum-poker-room.websocket.service';
import { PageTitleComponent } from '../../../shared/components/page-title/page-title.component';
import { MatButtonModule } from '@angular/material/button';
import { ScrumPokerVote } from '../../../core/models/scrum-poker-rooms/scrum-poker-vote.model';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UboardKeycloakService } from '../../../core/services/uboard-keycloak.service';
import { ScrumPokerRestApiService } from '../../../core/services/api/scrum-poker-rest-api.service';
import { ScrumPokerRoomData } from '../../../core/models/scrum-poker-rooms/srcum-poker-room-data.model';
import { User } from '../../../core/models/user.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scrum-poker-room',
  imports: [
    PageTitleComponent,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatIcon,
    MatProgressSpinnerModule,
    CommonModule,
  ],
  templateUrl: './scrum-poker-room.component.html',
  styleUrl: './scrum-poker-room.component.scss',
})
export class ScrumPokerRoomComponent implements OnInit {
  roomId!: string;
  votes: ScrumPokerVote[] = [];
  areVotesBeingDisplayed: boolean = false;
  availablePoints: string[] = ['0', '1', '2', '3', '5', '8', '13', '21'];
  displayedColumns: string[] = ['name', 'vote'];
  votesTableDataSource = new MatTableDataSource<ScrumPokerVote>(this.votes);

  scrumPokerRoomData: ScrumPokerRoomData = {
    uuid: '',
    name: '',
    userIdentifier: '',
    closed: false,
    createdAt: new Date(),
    isVotesVisible: false,
  };

  currentUser: User = {
    id: '',
    username: '',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private scrumPokerRoomWebSocketService: ScrumPokerRoomWebSocketService,
    private uboardKeycloakService: UboardKeycloakService,
    private scrumPokerRestApiService: ScrumPokerRestApiService
  ) {}

  async ngOnInit(): Promise<void> {
    this.roomId = this.route.snapshot.paramMap.get('roomId')!;
    await this.getSessionUserData();

    this.getCurrentScrumPokerRoomData();

    this.scrumPokerRoomWebSocketService.connect(
      this.currentUser.id,
      this.currentUser.username,
      this.roomId
    );

    this.scrumPokerRoomWebSocketService.votes$.subscribe((votes) => {
      this.votes = votes;
      this.votesTableDataSource.data = [...this.votes];
    });

    this.scrumPokerRoomWebSocketService.roomVotesVisibility$.subscribe(
      (isVotesVisible) => {
        this.areVotesBeingDisplayed = isVotesVisible;
      }
    );
  }

  ngOnDestroy(): void {
    this.scrumPokerRestApiService
      .deleteScrumPokerRoomUser(this.roomId, this.currentUser.id)
      .subscribe({
        next: (response) => {
          this.scrumPokerRoomWebSocketService.disconnect();
        },
        error: (error) => {
          this.scrumPokerRoomWebSocketService.disconnect();
        },
      });
  }

  areVotesDisplayed(): boolean {
    return this.areVotesBeingDisplayed;
  }

  changeDisplayStatusOfVotes() {
    this.areVotesBeingDisplayed = !this.areVotesBeingDisplayed;
    this.scrumPokerRoomWebSocketService.publishRoomVotesVisibilityChange(
      this.roomId,
      this.areVotesBeingDisplayed
    );
  }

  submitVote(vote: string): void {
    if (vote) {
      this.scrumPokerRoomWebSocketService.publishUserVote(
        this.currentUser.id,
        this.currentUser.username,
        this.roomId,
        vote
      );
    }
  }

  private async getSessionUserData() {
    this.currentUser = await this.uboardKeycloakService.getSessionUser();
  }

  private getCurrentScrumPokerRoomData() {
    this.scrumPokerRestApiService.getScrumPokerRoom(this.roomId).subscribe({
      next: (response) => {
        this.scrumPokerRoomData = response;
        this.areVotesBeingDisplayed = this.scrumPokerRoomData.isVotesVisible;
      },

      error: (error) => {
        console.error(error);
        this.router.navigate(['/scrum-poker/rooms']);
      },
    });
  }

  canViewVotesToggle(): boolean {
    return (
      !!this.currentUser &&
      !!this.currentUser.id &&
      !!this.scrumPokerRoomData &&
      !!this.scrumPokerRoomData.userIdentifier &&
      this.scrumPokerRoomData.userIdentifier === this.currentUser.id
    );
  }
}
