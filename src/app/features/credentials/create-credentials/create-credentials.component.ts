import { Component, inject } from '@angular/core';
import { PageTitleComponent } from '../../../shared/components/page-title/page-title.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ErrorStateMatcher } from '@angular/material/core';
import {
  FormBuilder,
  FormControl,
  FormGroupDirective,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CredentialsType } from '../../../core/models/credentials-type.model';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';

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
  availableCredentialTypes: CredentialsType[] = [
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

  matcher = new MyErrorStateMatcher();

  public createCredential() {
    if (this.newCredentialForm.valid) {
      console.log(this.newCredentialForm.value);
      this.router.navigate(['/credentials']);
    }
  }
}
