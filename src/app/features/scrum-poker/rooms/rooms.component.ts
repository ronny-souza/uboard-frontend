import { MatDialog } from '@angular/material/dialog';
import { Component, inject } from '@angular/core';
import { PageTitleComponent } from '../../../shared/components/page-title/page-title.component';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CreateRoomDialog } from './dialogs/create-room-dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rooms',
  imports: [PageTitleComponent, MatCardModule, MatIcon, MatButtonModule],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.scss',
})
export class RoomsComponent {
  readonly dialog = inject(MatDialog);

  constructor(private router: Router) {}

  openCreateRoomDialog() {
    const dialogRef = this.dialog.open(CreateRoomDialog, {
      width: '700px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.router.navigate([`/scrum-poker/rooms/${result.uuid}`], {
        state: { roomName: result.name },
      });
    });
  }
}
