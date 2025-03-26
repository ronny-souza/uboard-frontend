import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCard } from '@angular/material/card';

@Component({
  selector: 'app-vote-card',
  imports: [MatCard],
  templateUrl: './vote-card.component.html',
  styleUrl: './vote-card.component.scss',
})
export class VoteCardComponent {
  @Input() value!: string;
  @Input() selected: boolean = false;
  @Output() voteSelected = new EventEmitter<string>();

  onVote() {
    this.voteSelected.emit(this.value);
  }
}
