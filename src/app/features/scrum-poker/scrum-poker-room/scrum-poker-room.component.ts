import { Component, inject, OnInit } from '@angular/core';
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
import Swal from 'sweetalert2';
import { VoteCardComponent } from '../../../shared/components/vote-card/vote-card.component';
import {
  MatBottomSheet,
  MatBottomSheetModule,
} from '@angular/material/bottom-sheet';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { ScrumPokerRoomActionsComponent } from './actions/scrum-poker-room-actions/scrum-poker-room-actions.component';

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
    VoteCardComponent,
    MatBottomSheetModule,
  ],
  templateUrl: './scrum-poker-room.component.html',
  styleUrl: './scrum-poker-room.component.scss',
})
export class ScrumPokerRoomComponent implements OnInit {
  private _snackBar = inject(MatSnackBar);
  private _bottomSheet = inject(MatBottomSheet);
  roomId!: string;
  votes: ScrumPokerVote[] = [];
  areVotesBeingDisplayed: boolean = false;
  availablePoints: string[] = ['0', '1', '2', '3', '5', '8', '13', '21'];
  displayedColumns: string[] = ['name', 'vote'];
  votesTableDataSource = new MatTableDataSource<ScrumPokerVote>(this.votes);
  roomIsAvailable: boolean = true;
  currentVote: string = '-';

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

    this.subscribeOnVotesSocketToListen();
    this.subscribeOnVisibilityVotesSocketToListen();
    this.subscribeOnScrumPokerRoomStateSocketToListen();
  }

  ngOnDestroy(): void {
    this.scrumPokerRoomWebSocketService.publishScrumPokerRoomUserDisconnectEvent(
      this.roomId,
      this.currentUser.id
    );
    this.scrumPokerRoomWebSocketService.disconnect();
  }

  areVotesDisplayed(): boolean {
    return this.areVotesBeingDisplayed;
  }

  changeDisplayStatusOfVotes() {
    this.areVotesBeingDisplayed = !this.areVotesBeingDisplayed;
    this.scrumPokerRoomWebSocketService.publishScrumPokerRoomVotesVisibilityChangeEvent(
      this.roomId,
      this.areVotesBeingDisplayed
    );
  }

  submitVote(vote: string): void {
    if (vote) {
      if (vote === this.currentVote) {
        vote = '-';
      }
      this.currentVote = vote;
      this.scrumPokerRoomWebSocketService.publishScrumPokerRoomUserVoteEvent(
        this.currentUser.id,
        this.currentUser.username,
        this.roomId,
        vote
      );
    }
  }

  openBottomSheet(): void {
    const bottomSheetRef = this._bottomSheet.open(
      ScrumPokerRoomActionsComponent
    );

    bottomSheetRef.afterDismissed().subscribe((action) => {
      if (action === 'CLOSE_ROOM') {
        this.openCloseScrumPokerRoomRequest();
      }
    });
  }

  openCloseScrumPokerRoomRequest() {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Ao confirmar, você encerrará a sala de votação para todos os participantes.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef233c',
      cancelButtonColor: '#686E73',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.scrumPokerRoomData.closed = true;
        this.scrumPokerRoomWebSocketService.publishCloseScrumPokerRoomEvent(
          this.scrumPokerRoomData.uuid,
          this.currentUser.id
        );

        this.openSnackBarWithMessage(
          `Sua solicitação para o fechamento da sala ${this.scrumPokerRoomData.name} foi enviada com sucesso!`
        );

        setTimeout(() => {
          this.router.navigate(['/scrum-poker/rooms']);
        }, 5000);
      }
    });
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
        this.roomIsAvailable = false;
        this.openSnackBarWithMessage(
          'Atenção, usuário! A sala não existe ou foi fechada por seu administrador. Você será redirecionado de volta às suas salas.'
        );
        setTimeout(() => {
          this.router.navigate(['/scrum-poker/rooms']);
        }, 5000);
      },
    });
  }

  canViewAdministratorActions(): boolean {
    return (
      !!this.currentUser &&
      !!this.currentUser.id &&
      !!this.scrumPokerRoomData &&
      !!this.scrumPokerRoomData.userIdentifier &&
      this.scrumPokerRoomData.userIdentifier === this.currentUser.id
    );
  }

  private subscribeOnVotesSocketToListen() {
    this.scrumPokerRoomWebSocketService.votes$.subscribe((votes) => {
      this.votes = votes;
      this.currentVote =
        this.votes.find((vote) => vote.userIdentifier === this.currentUser.id)
          ?.vote || '-';
      this.votesTableDataSource.data = [...this.votes];
    });
  }

  private subscribeOnVisibilityVotesSocketToListen() {
    this.scrumPokerRoomWebSocketService.roomVotesVisibility$.subscribe(
      (isVotesVisible) => {
        this.areVotesBeingDisplayed = isVotesVisible;
      }
    );
  }

  private subscribeOnScrumPokerRoomStateSocketToListen() {
    this.scrumPokerRoomWebSocketService.scrumPokerRoomClosedState$.subscribe(
      (scrumPokerRoomState) => {
        this.scrumPokerRoomData.closed =
          this.roomId === scrumPokerRoomState.roomId &&
          scrumPokerRoomState.closed;

        if (this.scrumPokerRoomData.closed) {
          this.openSnackBarWithMessage(
            `Atenção, usuário! A sala ${this.scrumPokerRoomData.name} foi encerrada. Você será redirecionado em breve para suas salas.`
          );

          setTimeout(() => {
            this.router.navigate(['/scrum-poker/rooms']);
          }, 5000);
        }
      }
    );
  }

  private openSnackBarWithMessage(message: string) {
    // Candidato a componente
    const horizontalPosition: MatSnackBarHorizontalPosition = 'end';
    const verticalPosition: MatSnackBarVerticalPosition = 'top';
    const content = message;
    this._snackBar.open(content, 'X', {
      horizontalPosition: horizontalPosition,
      verticalPosition: verticalPosition,
      duration: 5000,
    });
  }
}
