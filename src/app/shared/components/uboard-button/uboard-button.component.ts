import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-uboard-button',
  imports: [MatButtonModule, MatIconModule, NgClass, MatTooltipModule],
  templateUrl: './uboard-button.component.html',
  styleUrl: './uboard-button.component.scss',
})
export class UboardButtonComponent {
  @Input() icon: string = '';
  @Input() tooltip: string = '';
  @Input() buttonStyle: 'primary' | 'danger' | 'secondary' = 'primary';
}
