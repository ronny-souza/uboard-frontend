import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-uboard-spinner',
  imports: [MatProgressSpinnerModule, TranslateModule],
  templateUrl: './uboard-spinner.component.html',
  styleUrl: './uboard-spinner.component.scss',
})
export class UboardSpinnerComponent {
  @Input() diameter: string = '60';
  @Input() translateKey: string = 'commons.LOADING';
}
