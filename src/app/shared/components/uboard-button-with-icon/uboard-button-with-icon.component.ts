import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-uboard-button-with-icon',
  imports: [ButtonModule, MatIcon, TranslateModule, NgClass],
  templateUrl: './uboard-button-with-icon.component.html',
  styleUrl: './uboard-button-with-icon.component.scss',
})
export class UboardButtonWithIconComponent {
  @Input() buttonStyle: 'primary' | 'danger' | 'secondary' = 'primary';
  @Input() label: string = '';
  @Input() icon: string = '';
}
