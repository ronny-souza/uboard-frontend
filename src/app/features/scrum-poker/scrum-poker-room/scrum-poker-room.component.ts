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

@Component({
  selector: 'app-scrum-poker-room',
  imports: [
    PageTitleComponent,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatIcon,
    MatProgressSpinnerModule,
  ],
  templateUrl: './scrum-poker-room.component.html',
  styleUrl: './scrum-poker-room.component.scss',
})
export class ScrumPokerRoomComponent implements OnInit {
  roomId!: string;
  roomName!: string;
  username: string = '';
  private userIdentifier = '';
  votes: ScrumPokerVote[] = [];
  areVotesBeingDisplayed: boolean = false;
  availablePoints: string[] = ['0', '1', '2', '3', '5', '8', '13', '21'];
  displayedColumns: string[] = ['name', 'vote'];
  votesTableDataSource = new MatTableDataSource<ScrumPokerVote>(this.votes);

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
      this.userIdentifier,
      this.username,
      this.roomId
    );

    this.scrumPokerRoomWebSocketService.votes$.subscribe((votes) => {
      this.votes = votes;
      this.votesTableDataSource.data = [...this.votes];
    });
  }

  ngOnDestroy(): void {
    this.scrumPokerRoomWebSocketService.disconnect();
  }

  areVotesDisplayed(): boolean {
    return this.areVotesBeingDisplayed;
  }

  changeDisplayStatusOfVotes() {
    this.areVotesBeingDisplayed = !this.areVotesBeingDisplayed;
  }

  submitVote(vote: string): void {
    if (vote) {
      this.scrumPokerRoomWebSocketService.publishUserVote(
        this.userIdentifier,
        this.username,
        this.roomId,
        vote
      );
    }
  }

  private async getSessionUserData() {
    const user = await this.uboardKeycloakService.getSessionUserProfileData();
    this.userIdentifier = user.id || '';
    this.username = user.username || '';
  }

  private getCurrentScrumPokerRoomData() {
    this.scrumPokerRestApiService.getScrumPokerRoom(this.roomId).subscribe({
      next: (response) => {
        this.roomName = response.name || 'Nome não encontrado';
      },

      error: (error) => {
        console.error(error);
        this.router.navigate(['/scrum-poker/rooms']);
      },
    });
  }
}
