import { CredentialsRestApiService } from './../../core/services/api/credentials-rest-api.service';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UboardPageTitleComponent } from '../../shared/components/uboard-page-title/uboard-page-title.component';
import { UboardButtonWithIconComponent } from '../../shared/components/uboard-button-with-icon/uboard-button-with-icon.component';
import { DatePipe, NgIf } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { UboardEmptyTableWarningComponent } from '../../shared/components/uboard-empty-table-warning/uboard-empty-table-warning.component';
import { UboardSpinnerComponent } from '../../shared/components/uboard-spinner/uboard-spinner.component';
import { Dialog } from 'primeng/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { OrganizationModel } from '../../core/models/organizations/organization.model';
import { OrganizationFilter } from '../../core/models/organizations/organization-filter.model';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { OrganizationsRestApiService } from '../../core/services/api/organizations-rest-api.service';
import { CredentialModel } from '../../core/models/credentials/credential.model';
import { CredentialFilterModel } from '../../core/models/credentials/credential-filter.model';
import { CredentialTypeEnum } from '../../core/models/credentials/credential-type.enum';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CredentialTargetModel } from '../../core/models/credentials/credential-target.model';
import { CreateOrganizationModel } from '../../core/models/organizations/create-organization.model';
import { SnackBarService } from '../../core/services/snack-bar.service.service';
import { OrganizationScopeEnum } from '../../core/models/organizations/organization-scope.enum';

@Component({
  selector: 'app-organizations',
  imports: [
    RouterModule,
    TranslateModule,
    DatePipe,
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
    ReactiveFormsModule,
    Dialog,
    MatProgressSpinnerModule,
    NgIf,
  ],
  templateUrl: './organizations.component.html',
  styleUrl: './organizations.component.scss',
})
export class OrganizationsComponent {
  organizations: OrganizationModel[] = [];
  selectedOrganizations!: OrganizationModel[];
  isLoadingOrganizations = true;
  pageSize = 5;
  totalElements = 0;
  lastLoadCredentialsTableEvent: any;
  isCreateOrganizationDialogVisible = false;

  availableCredentialTypes: string[] = ['GITLAB'];

  isLoadingScopeTypes = false;
  availableScopeTypes: { label: string; value: string }[] = [];

  isLoadingCredentials = false;
  credentials: CredentialModel[] = [];

  isLoadingTargets = false;
  targets: CredentialTargetModel[] = [];

  isScopeSelected = false;

  organizationsTableFilters: OrganizationFilter = {
    name: '',
    providerName: '',
    scope: OrganizationScopeEnum.NONE,
    type: CredentialTypeEnum.NONE,
  };

  scopeTypes: any[] = [
    OrganizationScopeEnum.GROUP,
    OrganizationScopeEnum.PROJECT,
  ];

  credentialTypes: any[] = [
    CredentialTypeEnum.GITLAB,
    CredentialTypeEnum.GITHUB,
  ];

  private _newOrganizationFormBuilder = inject(FormBuilder);
  public newOrganizationForm = this._newOrganizationFormBuilder.group({
    name: ['', Validators.required],
    type: ['', Validators.required],
    credential: [{ value: '', disabled: true }, Validators.required],
    scope: [{ value: '', disabled: true }, Validators.required],
    target: [
      { value: { id: 0, name: '' }, disabled: true },
      Validators.required,
    ],
  });

  constructor(
    private organizationsRestApiService: OrganizationsRestApiService,
    private credentialsRestApiService: CredentialsRestApiService,
    private translate: TranslateService,
    private snackBarService: SnackBarService
  ) {}

  listOrganizationsAsPage(event: any) {
    this.lastLoadCredentialsTableEvent = event;
    this.isLoadingOrganizations = true;
    this.organizations = [];
    const page = Math.floor(event.first / event.rows);
    const size = event.rows;
    this.pageSize = size;

    const filters = this.cleanEmptyFilters(this.organizationsTableFilters);

    this.organizationsRestApiService
      .listOrganizationsAsPage(page, size, filters)
      .subscribe((response) => {
        this.organizations = response.content;
        this.totalElements = response.page.totalElements;
        this.isLoadingOrganizations = false;
      });
  }

  hasItems() {
    return this.organizations.length > 0;
  }

  refreshOrganizationsTable() {
    this.listOrganizationsAsPage(this.lastLoadCredentialsTableEvent);
  }

  /* CREATE ORGANIZATION PROPERTIES */

  openCreateOrganizationDialog() {
    this.isCreateOrganizationDialogVisible = true;
  }

  onChangeProviderType() {
    const type = this.newOrganizationForm.get('type')?.value;
    const providerTypeAsEnum: CredentialTypeEnum =
      CredentialTypeEnum[type as keyof typeof CredentialTypeEnum];

    this.listAvailableCredentials(providerTypeAsEnum);
    this.listAvailableScopes(providerTypeAsEnum);
  }

  onChangeScope() {
    const scope = this.newOrganizationForm.get('scope')?.value;
    this.isScopeSelected = true;
    const credential = this.newOrganizationForm.get('credential')?.value;
    this.isLoadingTargets = true;

    if (credential != null && credential != undefined) {
      if (scope === 'PROJECT') {
        this.credentialsRestApiService
          .listCredentialProjects(credential)
          .subscribe((response) => {
            this.targets = response;
            this.isLoadingTargets = false;

            if (this.targets.length > 0) {
              this.newOrganizationForm.get('target')?.enable();
            }
          });
      } else {
        this.credentialsRestApiService
          .listCredentialGroups(credential)
          .subscribe((response) => {
            this.targets = response;
            this.isLoadingTargets = false;

            if (this.targets.length > 0) {
              this.newOrganizationForm.get('target')?.enable();
            }
          });
      }
    }
  }

  listAvailableCredentials(providerTypeAsEnum: CredentialTypeEnum) {
    this.isLoadingCredentials = true;
    this.credentials = [];
    const page = 0;
    const size = 400;

    const filters: CredentialFilterModel = {
      type: providerTypeAsEnum,
    };

    this.credentialsRestApiService
      .listCredentialsAsPage(page, size, filters)
      .subscribe((response) => {
        this.credentials = response.content;
        this.totalElements = response.page.totalElements;
        this.isLoadingCredentials = false;

        if (this.credentials.length > 0) {
          this.newOrganizationForm.get('credential')?.enable();
        }
      });
  }

  listAvailableScopes(providerTypeAsEnum: CredentialTypeEnum) {
    this.isLoadingScopeTypes = true;
    if (providerTypeAsEnum === CredentialTypeEnum.GITLAB) {
      this.availableScopeTypes = [
        {
          label: this.translate.instant('commons.PROJECT'),
          value: 'PROJECT',
        },
        {
          label: this.translate.instant('commons.GROUP'),
          value: 'GROUP',
        },
      ];
    }

    this.isLoadingScopeTypes = false;
    if (this.availableScopeTypes.length > 0) {
      this.newOrganizationForm.get('scope')?.enable();
    }
  }

  createOrganization() {
    if (this.newOrganizationForm.valid) {
      const body = this.newOrganizationForm.value as CreateOrganizationModel;
      this.organizationsRestApiService.createOrganization(body).subscribe({
        next: (response) => {
          this.snackBarService.openSnackBar(
            this.translate.instant(
              'messages.CREATE_ORGANIZATION_MESSAGE_SUCCESS'
            )
          );
          this.closeCreateOrganizationDialog();
        },

        error: (error) => {
          console.error(error);
          this.snackBarService.openSnackBar(
            this.translate.instant('messages.CREATE_ORGANIZATION_MESSAGE_ERROR')
          );
          this.closeCreateOrganizationDialog();
        },
      });
    }
  }

  closeCreateOrganizationDialog() {
    this.isCreateOrganizationDialogVisible = false;
    this.newOrganizationForm.reset({
      name: '',
      type: '',
      credential: '',
      scope: '',
      target: { id: 0, name: '' },
    });

    this.newOrganizationForm.get('credential')?.disable();
    this.newOrganizationForm.get('scope')?.disable();
    this.newOrganizationForm.get('target')?.disable();
    this.isScopeSelected = false;
  }

  /* END OF ORGANIZATION CREATION PROPERTIES */

  /* LISTING FILTERS PROPERTIES */

  updateFilter<K extends keyof OrganizationFilter>(
    field: K,
    value: OrganizationFilter[K]
  ) {
    if (value && value.length > 0) {
      this.organizationsTableFilters[field] = value;
      console.log(this.organizationsTableFilters);
    } else {
      delete this.organizationsTableFilters[field];
    }

    this.listOrganizationsAsPage(this.lastLoadCredentialsTableEvent);
  }

  clearFilter<K extends keyof OrganizationFilter>(field: K) {
    delete this.organizationsTableFilters[field];
    this.listOrganizationsAsPage(this.lastLoadCredentialsTableEvent);
  }

  private cleanEmptyFilters(
    filters: OrganizationFilter
  ): Partial<OrganizationFilter> {
    const cleanedFilters: Partial<OrganizationFilter> = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (
        value !== '' &&
        value !== null &&
        value !== undefined &&
        value !== CredentialTypeEnum.NONE &&
        value !== OrganizationScopeEnum.NONE
      ) {
        cleanedFilters[key as keyof OrganizationFilter] = value;
      }
    });

    return cleanedFilters;
  }
}
