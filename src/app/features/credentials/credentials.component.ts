import Swal from 'sweetalert2';
import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RemoteRepositoryCredentials } from '../../core/models/credentials/remote-repository-credentials.model';
import { EmptyTableMessageComponent } from '../../shared/components/empty-table-message/empty-table-message.component';
import { UboardButtonComponent } from '../../shared/components/uboard-button/uboard-button.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { PageTitleComponent } from '../../shared/components/page-title/page-title.component';
import { MatDialog } from '@angular/material/dialog';
import { CreateCredentialDialog } from './dialogs/create-credential/create-credential-dialog';
import { CredentialsRestApiService } from '../../core/services/api/credentials-rest-api.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SnackBarService } from '../../core/services/snack-bar.service.service';

@Component({
  selector: 'app-credentials',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    DatePipe,
    MatCardModule,
    MatIcon,
    MatButtonModule,
    EmptyTableMessageComponent,
    UboardButtonComponent,
    MatTooltipModule,
    RouterModule,
    PageTitleComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: './credentials.component.html',
  styleUrl: './credentials.component.scss',
})
export class CredentialsComponent implements AfterViewInit {
  readonly dialog = inject(MatDialog);

  displayedColumns: string[] = ['name', 'url', 'type', 'createdAt', 'actions'];
  credentials: RemoteRepositoryCredentials[] = [];
  totalElements = 0;
  isLoadingCredentials = true;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private credentialsRestApiService: CredentialsRestApiService,
    private snackBarService: SnackBarService
  ) {}

  ngAfterViewInit() {
    this.paginator.page.subscribe(() => this.listCredentialsAsPage());
    this.listCredentialsAsPage();
  }

  listCredentialsAsPage() {
    const page = this.paginator.pageIndex;
    const size = this.paginator.pageSize || 10;

    this.credentialsRestApiService
      .listCredentialsAsPage(page, size)
      .subscribe((response) => {
        this.credentials = response.content;
        this.totalElements = response.page.totalElements;
        this.isLoadingCredentials = false;
      });
  }

  refreshCredentials() {
    this.listCredentialsAsPage();
  }

  // applyFilter(value: string) {
  //   this.credentialsTableDataSource.filter = value.trim().toLowerCase();

  //   if (this.credentialsTableDataSource.paginator) {
  //     this.credentialsTableDataSource.paginator.firstPage();
  //   }
  // }

  hasItems() {
    return this.credentials.length > 0;
  }

  openCreateCredentialDialog() {
    const dialogRef = this.dialog.open(CreateCredentialDialog, {
      width: '900px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.listCredentialsAsPage();
    });
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
          this.listCredentialsAsPage();
          this.openDeleteCredentialSuccessSnackBar(credential.name);
        }
      }
    });
  }

  private openDeleteCredentialSuccessSnackBar(credentialName: string) {
    const message = `Sua solicitação para a exclusão da credencial ${credentialName} foi enviada com sucesso!`;
    this.snackBarService.openSnackBar(message);
  }
}
