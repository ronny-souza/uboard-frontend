import Keycloak from 'keycloak-js';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ScrumPokerService } from '../../../core/services/scrum-poker.service';
import { PageTitleComponent } from '../../../shared/components/page-title/page-title.component';
import { MatButtonModule } from '@angular/material/button';
import { ScrumPokerVote } from '../../../core/models/scrum-poker-vote.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ScrumPokerRoomData } from '../../../core/models/srcum-poker-room-data.model';
import { MatCardModule } from '@angular/material/card';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-scrum-poker-room',
  imports: [
    PageTitleComponent,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatIcon,
  ],
  templateUrl: './scrum-poker-room.component.html',
  styleUrl: './scrum-poker-room.component.scss',
})
export class ScrumPokerRoomComponent implements OnInit {
  roomId!: string;
  roomName!: string;
  votes: ScrumPokerVote[] = [];
  username: string = '';
  isVotesOpened: boolean = false;
  private userIdentifier = '';
  availablePoints: string[] = ['0', '1', '2', '3', '5', '8', '13', '21'];
  displayedColumns: string[] = ['name', 'vote'];
  votesTableDataSource = new MatTableDataSource<ScrumPokerVote>(this.votes);
  private readonly keycloak = inject(Keycloak);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private scrumPokerService: ScrumPokerService,
    private httpClient: HttpClient
  ) {}

  async ngOnInit(): Promise<void> {
    this.roomId = this.route.snapshot.paramMap.get('roomId')!;
    const user = await this.keycloak.loadUserProfile();
    this.userIdentifier = user.id || '';
    this.username = user.username || '';

    this.getScrumPokerRoom(this.roomId).subscribe({
      next: (response) => {
        this.roomName = response.name || 'Nome não encontrado';
      },

      error: (error) => {
        console.error(error);
        this.router.navigate(['/scrum-poker/rooms']);
      },
    });

    this.scrumPokerService.connect(
      this.userIdentifier,
      this.username,
      this.roomId
    );

    this.scrumPokerService.votes$.subscribe((votes) => {
      console.log(votes);
      this.votes = votes;
      this.votesTableDataSource.data = [...this.votes];
    });
  }

  isShowVotes(): boolean {
    return this.isVotesOpened;
  }

  displayOrHideVotes() {
    this.isVotesOpened = !this.isVotesOpened;
  }

  submitVote(vote: string): void {
    if (vote) {
      this.scrumPokerService.sendVote(
        this.userIdentifier,
        this.username,
        this.roomId,
        vote
      );
    }
  }

  getScrumPokerRoom(roomId: string): Observable<ScrumPokerRoomData> {
    return this.httpClient.get<ScrumPokerRoomData>(
      `http://localhost:8080/scrum-poker/room/${roomId}`
    );
  }

  ngOnDestroy(): void {
    this.scrumPokerService.disconnect();
  }
}
