import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormErrorStateMatcher } from '../../../../core/utils/form-error-state-matcher';
import { RemoteRepositoryCredentialsType } from '../../../../core/models/credentials/remote-repository-credentials-type.model';
import { Router } from '@angular/router';
import { CredentialsRestApiService } from '../../../../core/services/api/credentials-rest-api.service';
import { CreateRemoteRepositoryCredentials } from '../../../../core/models/credentials/create-remote-repository-credentials.model';
import { MatSelectModule } from '@angular/material/select';
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
import { SnackBarService } from '../../../../core/services/snack-bar.service.service';

@Component({
  selector: 'create-credential',
  templateUrl: 'create-credential-dialog.html',
  styleUrl: 'create-credential-dialog.scss',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    ReactiveFormsModule,
  ],
})
export class CreateCredentialDialog {
  readonly dialogRef = inject(MatDialogRef<CreateCredentialDialog>);
  availableCredentialTypes: RemoteRepositoryCredentialsType[] = [
    {
      label: 'Gitlab',
      value: 'GITLAB',
    },
  ];

  constructor(
    private credentialsRestApiService: CredentialsRestApiService,
    private snackBarService: SnackBarService
  ) {}

  private _newCredentialFormBuilder = inject(FormBuilder);

  public newCredentialForm = this._newCredentialFormBuilder.group({
    name: ['', Validators.required],
    url: ['', Validators.required],
    type: ['', Validators.required],
    token: ['', Validators.required],
  });

  public createCredential() {
    if (this.newCredentialForm.valid) {
      const body = this.newCredentialForm
        .value as CreateRemoteRepositoryCredentials;
      this.credentialsRestApiService
        .createRepositoryCredentials(body)
        .subscribe({
          next: (response) => {
            this.snackBarService.openSnackBar(
              `Atenção, usuário! Sua solicitação para registro de credencial foi enviada com sucesso.`
            );
            this.dialogRef.close();
          },

          error: (error) => {
            console.error(error);
            this.snackBarService.openSnackBar(
              `Atenção, usuário! Houve um erro em sua solicitação para o registro de credencial.`
            );
            this.dialogRef.close();
          },
        });
    }
  }

  matcher = new FormErrorStateMatcher();

  onNoClick(): void {
    this.dialogRef.close();
  }
}
