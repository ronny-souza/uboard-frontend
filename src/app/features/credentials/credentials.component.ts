import Swal from 'sweetalert2';
import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { v4 as uuidv4 } from 'uuid';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Credentials } from '../../core/models/credentials.model';
import { CustomInputFilterComponent } from '../../shared/components/custom-input-filter/custom-input-filter.component';
import { EmptyTableMessageComponent } from '../../shared/components/empty-table-message/empty-table-message.component';
import { UboardButtonComponent } from '../../shared/components/uboard-button/uboard-button.component';
import { MatTooltipModule } from '@angular/material/tooltip';

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
  ],
  templateUrl: './credentials.component.html',
  styleUrl: './credentials.component.scss',
})
export class CredentialsComponent implements AfterViewInit {
  displayedColumns: string[] = ['name', 'url', 'type', 'createdAt', 'actions'];
  credentials: Credentials[] = ELEMENT_DATA;
  credentialsTableDataSource = new MatTableDataSource<Credentials>(
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

  deleteCredential(credential: Credentials) {
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
        }
      }
    });
  }
}

const ELEMENT_DATA: Credentials[] = [
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
