import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-uboard-empty-table-warning',
  imports: [MatIconModule, TranslateModule],
  templateUrl: './uboard-empty-table-warning.component.html',
  styleUrl: './uboard-empty-table-warning.component.scss',
})
export class UboardEmptyTableWarningComponent {
  @Input() icon: string = 'fmd_bad';
  @Input() translateKey: string = 'empty.THERE_IS_NO_ITEMS_TO_SHOW';
}
