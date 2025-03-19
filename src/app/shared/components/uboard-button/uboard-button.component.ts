import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-uboard-button',
  imports: [MatButtonModule, MatIconModule, NgClass],
  templateUrl: './uboard-button.component.html',
  styleUrl: './uboard-button.component.scss',
})
export class UboardButtonComponent {
  @Input() icon: string = '';
  @Input() label: string = '';
  @Input() buttonStyle: 'primary' | 'danger' | 'secondary' = 'primary';
}
