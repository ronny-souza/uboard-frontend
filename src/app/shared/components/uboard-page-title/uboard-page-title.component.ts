import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-uboard-page-title',
  imports: [TranslateModule],
  templateUrl: './uboard-page-title.component.html',
  styleUrl: './uboard-page-title.component.scss',
})
export class UboardPageTitleComponent {
  @Input() titleTranslateKey: string = '';
  @Input() descriptionTranslateKey: string = '';
}
