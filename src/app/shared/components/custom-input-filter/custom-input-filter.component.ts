import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-custom-input-filter',
  imports: [MatFormFieldModule, MatInputModule],
  templateUrl: './custom-input-filter.component.html',
  styleUrl: './custom-input-filter.component.scss',
})
export class CustomInputFilterComponent {
  @Input() placeholder: string = 'Digite aqui...';
  @Input() label: string = 'Pesquisar...';
  @Output() onFilterChange = new EventEmitter<string>();

  onFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.onFilterChange.emit(value);
  }
}
