import { CreateScrumPokerRoomForm } from './../../../../core/models/scrum-poker-rooms/create-scrum-poker-room.model';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ScrumPokerRestApiService } from '../../../../core/services/api/scrum-poker-rest-api.service';
import { SnackBarService } from '../../../../core/services/snack-bar.service.service';

@Component({
  selector: 'app-create-scrum-poker-room-dialog',
  imports: [
    Dialog,
    TranslateModule,
    ReactiveFormsModule,
    SelectModule,
    MatProgressSpinnerModule,
    ButtonModule,
    FormsModule,
    InputTextModule,
  ],
  templateUrl: './create-scrum-poker-room-dialog.component.html',
  styleUrl: './create-scrum-poker-room-dialog.component.scss',
})
export class CreateScrumPokerRoomDialogComponent implements OnInit {
  @Input() isVisible: boolean = false;
  @Input() organization!: string;
  @Input() milestone!: string;
  @Output() isCreateScrumPokerRoomDialogOpened = new EventEmitter<boolean>();
  @Output() scrumPokerRoomData = new EventEmitter<any>();

  private _createScrumPokerRoomFormBuilder = inject(FormBuilder);

  public createScrumPokerRoomForm = this._createScrumPokerRoomFormBuilder.group(
    {
      name: ['', Validators.required],
      milestone: [''],
    }
  );

  constructor(
    private scrumPokerRestApiService: ScrumPokerRestApiService,
    private snackBarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.createScrumPokerRoomForm.patchValue({
      milestone: this.milestone,
    });
  }

  createScrumPokerRoom() {
    const body = this.createScrumPokerRoomForm
      .value as CreateScrumPokerRoomForm;

    this.scrumPokerRestApiService.createScrumPokerRoom(body).subscribe({
      next: (response) => {
        this.snackBarService.openSnackBar(
          `Atenção, usuário! Sua sala foi criada com sucesso e você será redirecionado para ela.`
        );
        this.scrumPokerRoomData.emit({
          name: response.name,
          uuid: response.uuid,
          milestone: this.milestone,
        });
        this.closeDialog();
      },

      error: (error) => {
        console.error(error);
        this.snackBarService.openSnackBar(
          `Atenção, usuário! Houve um erro em sua solicitação para a criação de uma nova sala.`
        );
        this.closeDialog();
      },
    });
  }

  closeDialog() {
    this.isVisible = false;
    this.isCreateScrumPokerRoomDialogOpened.emit(false);
    this.createScrumPokerRoomForm.reset();
  }
}
