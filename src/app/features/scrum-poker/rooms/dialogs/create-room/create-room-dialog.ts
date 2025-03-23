import { Component, inject, model } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroupDirective,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpClient } from '@angular/common/http';
import { ErrorStateMatcher } from '@angular/material/core';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

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

  constructor(private httpClient: HttpClient) {}

  createScrumPokerRoom() {
    const body = {
      name: this.createScrumPokerRoomForm.get('name')?.value,
      userIdentifier: '1234',
    };

    this.httpClient
      .post<any>('http://localhost:8080/scrum-poker/room', body)
      .subscribe({
        next: (response) => {
          this.dialogRef.close({
            name: response.name,
            uuid: response.uuid,
          });
        },

        error: (error) => {
          console.error(error);
          this.dialogRef.close();
        },
      });
  }

  matcher = new MyErrorStateMatcher();

  onNoClick(): void {
    this.dialogRef.close();
  }
}
