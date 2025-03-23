import { Component, inject } from '@angular/core';
import { PageTitleComponent } from '../../../shared/components/page-title/page-title.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RemoteRepositoryCredentialsType } from '../../../core/models/credentials/remote-repository-credentials-type.model';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { FormErrorStateMatcher } from '../../../core/utils/form-error-state-matcher';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-create-credentials',
  imports: [
    PageTitleComponent,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIcon,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './create-credentials.component.html',
  styleUrl: './create-credentials.component.scss',
})
export class CreateCredentialsComponent {
  availableCredentialTypes: RemoteRepositoryCredentialsType[] = [
    {
      label: 'Gitlab',
      value: 'GITLAB',
    },
  ];

  constructor(private router: Router) {}

  private _newCredentialFormBuilder = inject(FormBuilder);

  public newCredentialForm = this._newCredentialFormBuilder.group({
    name: ['', Validators.required],
    url: ['', Validators.required],
    type: ['', Validators.required],
    token: ['', Validators.required],
  });

  matcher = new FormErrorStateMatcher();

  public createCredential() {
    if (this.newCredentialForm.valid) {
      this.router.navigate(['/credentials']);
    }
  }
}
