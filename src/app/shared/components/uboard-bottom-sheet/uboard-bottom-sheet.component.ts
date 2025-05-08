import { Component, Inject, inject, Input } from '@angular/core';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { MatIcon } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { UboardBottomSheetItemModel } from '../../../core/models/uboard-bottom-sheet-item.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-uboard-bottom-sheet',
  imports: [MatListModule, MatIcon, TranslateModule],
  templateUrl: './uboard-bottom-sheet.component.html',
  styleUrl: './uboard-bottom-sheet.component.scss',
})
export class UboardBottomSheetComponent {
  @Input() items: UboardBottomSheetItemModel[] = [];

  private _bottomSheetRef =
    inject<MatBottomSheetRef<UboardBottomSheetComponent>>(MatBottomSheetRef);

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA)
    public data: { items: UboardBottomSheetItemModel[] }
  ) {
    this.items = data.items;
  }

  choseAction(action: string): void {
    this._bottomSheetRef.dismiss(action);
  }
}
