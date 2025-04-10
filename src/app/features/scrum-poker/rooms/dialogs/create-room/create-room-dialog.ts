import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormErrorStateMatcher } from '../../../../../core/utils/form-error-state-matcher';
import { ScrumPokerRestApiService } from '../../../../../core/services/api/scrum-poker-rest-api.service';
import { SnackBarService } from '../../../../../core/services/snack-bar.service.service';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';

@Component({
  selector: 'create-room',
  templateUrl: 'create-room-dialog.html',
  styleUrl: 'create-room-dialog.scss',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    ReactiveFormsModule,
  ],
})
export class CreateRoomDialog {
  readonly dialogRef = inject(MatDialogRef<CreateRoomDialog>);
  private _createScrumPokerRoomFormBuilder = inject(FormBuilder);

  public createScrumPokerRoomForm = this._createScrumPokerRoomFormBuilder.group(
    {
      name: ['', Validators.required],
    }
  );

  constructor(
    private scrumPokerRestApiService: ScrumPokerRestApiService,
    private snackBarService: SnackBarService
  ) {}

  createScrumPokerRoom() {
    const name = this.createScrumPokerRoomForm.get('name')?.value;

    this.scrumPokerRestApiService
      .createScrumPokerRoom(name || 'Minha Sala')
      .subscribe({
        next: (response) => {
          this.snackBarService.openSnackBar(
            `Atenção, usuário! Sua sala foi criada com sucesso e você será redirecionado para ela.`
          );
          this.dialogRef.close({
            name: response.name,
            uuid: response.uuid,
          });
        },

        error: (error) => {
          console.error(error);
          this.snackBarService.openSnackBar(
            `Atenção, usuário! Houve um erro em sua solicitação para a criação de uma nova sala.`
          );
          this.dialogRef.close();
        },
      });
  }

  matcher = new FormErrorStateMatcher();

  onNoClick(): void {
    this.dialogRef.close();
  }
}
