import Swal from 'sweetalert2';
import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { v4 as uuidv4 } from 'uuid';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RemoteRepositoryCredentials } from '../../core/models/credentials/remote-repository-credentials.model';
import { CustomInputFilterComponent } from '../../shared/components/custom-input-filter/custom-input-filter.component';
import { EmptyTableMessageComponent } from '../../shared/components/empty-table-message/empty-table-message.component';
import { UboardButtonComponent } from '../../shared/components/uboard-button/uboard-button.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { PageTitleComponent } from '../../shared/components/page-title/page-title.component';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

@Component({
  selector: 'app-credentials',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    DatePipe,
    MatCardModule,
    MatIcon,
    MatButtonModule,
    CustomInputFilterComponent,
    EmptyTableMessageComponent,
    UboardButtonComponent,
    MatTooltipModule,
    RouterModule,
    PageTitleComponent,
  ],
  templateUrl: './credentials.component.html',
  styleUrl: './credentials.component.scss',
})
export class CredentialsComponent implements AfterViewInit {
  private _snackBar = inject(MatSnackBar);
  displayedColumns: string[] = ['name', 'url', 'type', 'createdAt', 'actions'];
  credentials: RemoteRepositoryCredentials[] = ELEMENT_DATA;
  credentialsTableDataSource = new MatTableDataSource<RemoteRepositoryCredentials>(
    this.credentials
  );

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.credentialsTableDataSource.paginator = this.paginator;
  }

  applyFilter(value: string) {
    this.credentialsTableDataSource.filter = value.trim().toLowerCase();

    if (this.credentialsTableDataSource.paginator) {
      this.credentialsTableDataSource.paginator.firstPage();
    }
  }

  hasItems() {
    return this.credentialsTableDataSource.paginator?.length;
  }

  deleteCredential(credential: RemoteRepositoryCredentials) {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Ao confirmar, não será possível recuperar a credencial excluída.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#BA1A1A',
      cancelButtonColor: '#686E73',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        const indexToRemove = this.credentials.findIndex(
          (credentialFromArray) => credentialFromArray.uuid === credential.uuid
        );
        if (indexToRemove !== -1) {
          this.credentials.splice(indexToRemove, 1);
          this.credentialsTableDataSource.data = [...this.credentials];
          this.openDeleteCredentialSuccessSnackBar(credential.name);
        }
      }
    });
  }

  openDeleteCredentialSuccessSnackBar(credentialName: string) {
    // Candidato a componente
    const horizontalPosition: MatSnackBarHorizontalPosition = 'end';
    const verticalPosition: MatSnackBarVerticalPosition = 'top';
    const content = `Sua solicitação para a exclusão da credencial ${credentialName} foi enviada com sucesso!`;
    this._snackBar.open(content, 'X', {
      horizontalPosition: horizontalPosition,
      verticalPosition: verticalPosition,
      duration: 5000,
    });
  }
}

const ELEMENT_DATA: RemoteRepositoryCredentials[] = [
  {
    uuid: uuidv4(),
    name: 'Gitlab Public Credentials 1',
    url: 'https://gitlab.com',
    type: 'GITLAB',
    createdAt: new Date(),
  },

  {
    uuid: uuidv4(),
    name: 'Gitlab Public Credentials 2',
    url: 'https://gitlab.com',
    type: 'GITLAB',
    createdAt: new Date(),
  },

  {
    uuid: uuidv4(),
    name: 'Gitlab Public Credentials 3',
    url: 'https://gitlab.com',
    type: 'GITLAB',
    createdAt: new Date(),
  },

  {
    uuid: uuidv4(),
    name: 'Gitlab Public Credentials 4',
    url: 'https://gitlab.com',
    type: 'GITLAB',
    createdAt: new Date(),
  },

  {
    uuid: uuidv4(),
    name: 'Gitlab Public Credentials 5',
    url: 'https://gitlab.com',
    type: 'GITLAB',
    createdAt: new Date(),
  },

  {
    uuid: uuidv4(),
    name: 'Gitlab Public Credentials 6',
    url: 'https://gitlab.com',
    type: 'GITLAB',
    createdAt: new Date(),
  },

  {
    uuid: uuidv4(),
    name: 'Gitlab Public Credentials 7',
    url: 'https://gitlab.com',
    type: 'GITLAB',
    createdAt: new Date(),
  },

  {
    uuid: uuidv4(),
    name: 'Gitlab Public Credentials 8',
    url: 'https://gitlab.com',
    type: 'GITLAB',
    createdAt: new Date(),
  },

  {
    uuid: uuidv4(),
    name: 'Gitlab Public Credentials 9',
    url: 'https://gitlab.com',
    type: 'GITLAB',
    createdAt: new Date(),
  },

  {
    uuid: uuidv4(),
    name: 'Gitlab Public Credentials 10',
    url: 'https://gitlab.com',
    type: 'GITLAB',
    createdAt: new Date(),
  },
];
