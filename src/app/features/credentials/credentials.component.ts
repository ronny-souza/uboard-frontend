import Swal from 'sweetalert2';
import { Component, inject, OnDestroy } from '@angular/core';
import { DatePipe, NgIf } from '@angular/common';
import { RemoteRepositoryCredentials } from '../../core/models/credentials/remote-repository-credentials.model';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CreateCredentialDialog } from './dialogs/create-credential/create-credential-dialog';
import { CredentialsRestApiService } from '../../core/services/api/credentials-rest-api.service';
import { SnackBarService } from '../../core/services/snack-bar.service.service';
import { UboardEmptyTableWarningComponent } from '../../shared/components/uboard-empty-table-warning/uboard-empty-table-warning.component';
import { UboardPageTitleComponent } from '../../shared/components/uboard-page-title/uboard-page-title.component';
import { CardModule } from 'primeng/card';
import { UboardButtonWithIconComponent } from '../../shared/components/uboard-button-with-icon/uboard-button-with-icon.component';
import { TableModule } from 'primeng/table';
import { CredentialsFilter } from '../../core/models/credentials/credentials-filter.model';
import { Subject } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { UboardSpinnerComponent } from '../../shared/components/uboard-spinner/uboard-spinner.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { CredentialTypeEnum } from '../../core/models/credentials/credential-type.enum';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-credentials',
  imports: [
    RouterModule,
    TranslateModule,
    DatePipe,
    NgIf,
    FormsModule,
    CardModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    UboardEmptyTableWarningComponent,
    UboardPageTitleComponent,
    UboardButtonWithIconComponent,
    UboardSpinnerComponent,
  ],
  templateUrl: './credentials.component.html',
  styleUrl: './credentials.component.scss',
})
export class CredentialsComponent implements OnDestroy {
  readonly dialog = inject(MatDialog);

  displayedColumns: string[] = ['name', 'url', 'type', 'createdAt'];
  credentials: RemoteRepositoryCredentials[] = [];
  selectedCredentials!: RemoteRepositoryCredentials[];
  totalElements = 0;
  pageSize = 5;
  isLoadingCredentials = true;
  lastLoadCredentialsTableEvent: any;

  credentialsTableFilters: CredentialsFilter = {
    name: '',
    url: '',
    type: CredentialTypeEnum.NONE,
  };

  credentialTypes: any[] = [
    CredentialTypeEnum.GITLAB,
    CredentialTypeEnum.GITHUB,
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private credentialsRestApiService: CredentialsRestApiService,
    private snackBarService: SnackBarService
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  listCredentialsAsPage(event: any) {
    this.lastLoadCredentialsTableEvent = event;
    this.isLoadingCredentials = true;
    this.credentials = [];
    const page = Math.floor(event.first / event.rows);
    const size = event.rows;
    this.pageSize = size;

    const filters = this.cleanEmptyFilters(this.credentialsTableFilters);

    this.credentialsRestApiService
      .listCredentialsAsPage(page, size, filters)
      .subscribe((response) => {
        this.credentials = response.content;
        this.totalElements = response.page.totalElements;
        this.isLoadingCredentials = false;
      });
  }

  refreshCredentials() {
    this.listCredentialsAsPage(this.lastLoadCredentialsTableEvent);
  }

  hasItems() {
    return this.credentials.length > 0;
  }

  openCreateCredentialDialog() {
    const dialogRef = this.dialog.open(CreateCredentialDialog, {
      width: '900px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.listCredentialsAsPage(this.lastLoadCredentialsTableEvent);
    });
  }

  deleteCredentials() {
    console.log(this.selectedCredentials);
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
          this.listCredentialsAsPage(this.lastLoadCredentialsTableEvent);
          this.openDeleteCredentialSuccessSnackBar(credential.name);
        }
      }
    });
  }

  private openDeleteCredentialSuccessSnackBar(credentialName: string) {
    const message = `Sua solicitação para a exclusão da credencial ${credentialName} foi enviada com sucesso!`;
    this.snackBarService.openSnackBar(message);
  }

  updateFilter<K extends keyof CredentialsFilter>(
    field: K,
    value: CredentialsFilter[K]
  ) {
    if (value && value !== CredentialTypeEnum.NONE && value.length > 0) {
      this.credentialsTableFilters[field] = value;
    } else {
      delete this.credentialsTableFilters[field];
    }

    this.listCredentialsAsPage(this.lastLoadCredentialsTableEvent);
  }

  clearFilter<K extends keyof CredentialsFilter>(field: K) {
    delete this.credentialsTableFilters[field];
    this.listCredentialsAsPage(this.lastLoadCredentialsTableEvent);
  }

  private cleanEmptyFilters(
    filters: CredentialsFilter
  ): Partial<CredentialsFilter> {
    const cleanedFilters: Partial<CredentialsFilter> = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (
        value !== '' &&
        value !== null &&
        value !== undefined &&
        value !== CredentialTypeEnum.NONE
      ) {
        cleanedFilters[key as keyof CredentialsFilter] = value;
      }
    });

    return cleanedFilters;
  }
}
