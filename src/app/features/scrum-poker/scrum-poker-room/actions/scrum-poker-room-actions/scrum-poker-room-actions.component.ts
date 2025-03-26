import { Component, inject } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatIcon } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-scrum-poker-room-actions',
  imports: [MatListModule, MatIcon],
  templateUrl: './scrum-poker-room-actions.component.html',
  styleUrl: './scrum-poker-room-actions.component.scss',
})
export class ScrumPokerRoomActionsComponent {
  private _bottomSheetRef =
    inject<MatBottomSheetRef<ScrumPokerRoomActionsComponent>>(
      MatBottomSheetRef
    );

  selectAction(action: string): void {
    this._bottomSheetRef.dismiss(action);
  }
}
