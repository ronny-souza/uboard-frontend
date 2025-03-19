import { Component, Input } from '@angular/core';
import { MatIcon, MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-empty-table-message',
  imports: [MatIconModule],
  templateUrl: './empty-table-message.component.html',
  styleUrl: './empty-table-message.component.scss',
})
export class EmptyTableMessageComponent {
  @Input() message: string = 'Não há informações para exibir!';
  @Input() icon: string = 'warning';
}
