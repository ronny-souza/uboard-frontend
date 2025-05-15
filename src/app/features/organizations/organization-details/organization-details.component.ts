import { OrganizationModel } from './../../../core/models/organizations/organization.model';
import { Component, inject, OnInit } from '@angular/core';
import { UboardPageTitleComponent } from '../../../shared/components/uboard-page-title/uboard-page-title.component';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { OrganizationsRestApiService } from '../../../core/services/api/organizations-rest-api.service';
import { SnackBarService } from '../../../core/services/snack-bar.service.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DatePipe, NgIf } from '@angular/common';
import { UboardSpinnerComponent } from '../../../shared/components/uboard-spinner/uboard-spinner.component';
import { UboardBottomSheetComponent } from '../../../shared/components/uboard-bottom-sheet/uboard-bottom-sheet.component';
import { UboardBottomSheetItemModel } from '../../../core/models/uboard-bottom-sheet-item.model';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { UboardButtonWithIconComponent } from '../../../shared/components/uboard-button-with-icon/uboard-button-with-icon.component';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { MilestoneModel } from '../../../core/models/milestones/milestone.model';
import { MilestoneFilter } from '../../../core/models/milestones/milestone-filter.model';
import { FormsModule } from '@angular/forms';
import { UboardEmptyTableWarningComponent } from '../../../shared/components/uboard-empty-table-warning/uboard-empty-table-warning.component';
import { ButtonModule } from 'primeng/button';
import { MatIcon } from '@angular/material/icon';
import { SynchronizeOrganizationMilestoneDialogComponent } from '../dialogs/synchronize-organization-milestone-dialog/synchronize-organization-milestone-dialog.component';
import { BadgeModule } from 'primeng/badge';
import { Tooltip } from 'primeng/tooltip';
import Swal from 'sweetalert2';
import { SynchronizeMilestoneModel } from '../../../core/models/milestones/synchronize-milestone.model';
import { SelectModule } from 'primeng/select';
import { CreateScrumPokerRoomDialogComponent } from '../dialogs/create-scrum-poker-room-dialog/create-scrum-poker-room-dialog.component';

@Component({
  selector: 'app-organization-details',
  imports: [
    RouterModule,
    UboardPageTitleComponent,
    NgIf,
    UboardSpinnerComponent,
    UboardButtonWithIconComponent,
    CardModule,
    TableModule,
    TranslateModule,
    InputTextModule,
    FormsModule,
    DatePipe,
    UboardEmptyTableWarningComponent,
    ButtonModule,
    MatIcon,
    SynchronizeOrganizationMilestoneDialogComponent,
    BadgeModule,
    Tooltip,
    SelectModule,
    CreateScrumPokerRoomDialogComponent,
  ],
  templateUrl: './organization-details.component.html',
  styleUrl: './organization-details.component.scss',
})
export class OrganizationDetailsComponent implements OnInit {
  organizationId!: string;
  organization!: OrganizationModel;
  isOrganizationAvailable: boolean = false;
  isLoadingOrganization: boolean = true;

  milestones: MilestoneModel[] = [];
  isLoadingMilestones: boolean = true;
  selectedMilestones!: MilestoneModel[];
  milestonesPageSize = 5;
  milestonesTotalElements = 0;
  lastLoadMilestonesTableEvent: any;
  milestonesTableFilters: MilestoneFilter = {
    title: '',
  };

  isSynchronizeMilestoneDialogVisible = false;
  isCreateScrumPokerRoomDialogVisible = false;

  currentMilestone: string = '';

  milestoneStates: string[] = ['ACTIVE', 'CLOSED'];

  private _bottomSheet = inject(MatBottomSheet);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private organizationRestApiService: OrganizationsRestApiService,
    private snackBarService: SnackBarService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.organizationId = this.route.snapshot.paramMap.get('organizationId')!;
    this.getOrganization();
  }

  private getOrganization() {
    this.isLoadingOrganization = true;
    this.organizationRestApiService
      .getSingleOrganization(this.organizationId)
      .subscribe({
        next: (response) => {
          this.organization = response;
          this.isOrganizationAvailable = true;
          this.isLoadingOrganization = false;
        },

        error: (error) => {
          console.error(error);
          this.isOrganizationAvailable = false;
          this.snackBarService.openSnackBar(
            'Atenção, usuário! A sala não existe ou foi fechada por seu administrador. Você será redirecionado de volta às suas salas.'
          );
          setTimeout(() => {
            this.router.navigate(['/organizations']);
          }, 5000);
        },
      });
  }

  /** ORGANIZATION MILESTONES PROPERTIES */

  openSynchronizeMilestoneDialog() {
    this.isSynchronizeMilestoneDialogVisible = true;
  }

  refreshMilestonesTable() {
    this.listOrganizationMilestonesAsPage(this.lastLoadMilestonesTableEvent);
  }

  listOrganizationMilestonesAsPage(event: any) {
    this.lastLoadMilestonesTableEvent = event;
    this.isLoadingMilestones = true;
    this.milestones = [];
    const page = Math.floor(event.first / event.rows);
    const size = event.rows;
    this.milestonesPageSize = size;

    const filters = this.cleanEmptyMilestonesFilters(
      this.milestonesTableFilters
    );

    this.organizationRestApiService
      .listOrganizationMilestonesAsPage(
        this.organizationId,
        page,
        size,
        filters
      )
      .subscribe((response) => {
        this.milestones = response.content;
        this.milestonesTotalElements = response.page.totalElements;
        this.isLoadingMilestones = false;
      });
  }

  synchronizeSingleMilestone(milestone: MilestoneModel) {
    Swal.fire({
      title: this.translateService.instant('actions.SYNCHRONIZE_MILESTONE'),
      text: this.translateService.instant(
        'actions.description.SYNCHRONIZE_MILESTONE_DESCRIPTION'
      ),
      icon: 'success',
      showCancelButton: true,
      confirmButtonColor: '#fe6c38',
      cancelButtonColor: '#686E73',
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        const body: SynchronizeMilestoneModel = {
          organization: this.organizationId,
          milestone: {
            id: milestone.providerId,
            title: milestone.title,
          },
          isAutoSync: milestone.isAutoSync,
          isImporting: false,
          frequency: milestone.frequency,
          hours: milestone.hours,
          minutes: milestone.minutes,
          weekDay: milestone.weekDay,
        };
        this.organizationRestApiService
          .synchronizeMilestone(this.organizationId, body)
          .subscribe({
            next: (response) => {
              this.snackBarService.openSnackBar(
                this.translateService.instant(
                  'messages.SYNCHRONIZE_MILESTONE_MESSAGE_SUCCESS'
                )
              );
            },

            error: (error) => {
              console.error(error);
              this.snackBarService.openSnackBar(
                this.translateService.instant(
                  'messages.SYNCHRONIZE_MILESTONE_MESSAGE_ERROR'
                )
              );
            },
          });
      }
    });
  }

  hasMilestones() {
    return this.milestones.length > 0;
  }

  /** END ORGANIZATION MILESTONE PROPERTIES */

  /** ORGANIZATION MILESTONE SCRUM POKER ROOMS PROPERTIES */
  openCreateScrumPokerRoomDialog(milestone: MilestoneModel) {
    this.currentMilestone = milestone.uuid;
    this.isCreateScrumPokerRoomDialogVisible = true;
  }

  redirectToScrumPokerRoom(event: {
    name: string;
    uuid: string;
    milestone: string;
  }) {
    this.router.navigate([
      `/organizations/${this.organizationId}/milestones/${event.milestone}/scrum-poker-rooms/${event.uuid}`,
    ]);
  }

  /** END ORGANIZATION MILESTONE SCRUM POKER ROOMS PROPERTIES */

  openBottomSheet() {
    const bottomSheetRef = this._bottomSheet.open(UboardBottomSheetComponent, {
      data: {
        items: [
          {
            icon: 'delete',
            titleTranslateKey: 'actions.DELETE_ORGANIZATION',
            descriptionTranslateKey:
              'actions.description.DELETE_ORGANIZATION_DESCRIPTION',
            action: 'DELETE_ORGANIZATION',
          },
        ] as UboardBottomSheetItemModel[],
      },
    });

    bottomSheetRef.afterDismissed().subscribe((action) => {
      if (action === 'DELETE_ORGANIZATION') {
        console.log('Holy! It Works!!!');
      }
    });
  }

  backToOrganizations() {
    this.router.navigate(['/organizations']);
  }

  /* LISTING FILTERS PROPERTIES */

  updateMilestoneFilter<K extends keyof MilestoneFilter>(
    field: K,
    value: MilestoneFilter[K]
  ) {
    if (value && value.length > 0) {
      this.milestonesTableFilters[field] = value;
    } else {
      delete this.milestonesTableFilters[field];
    }

    this.listOrganizationMilestonesAsPage(this.lastLoadMilestonesTableEvent);
  }

  clearMilestoneFilter<K extends keyof MilestoneFilter>(field: K) {
    delete this.milestonesTableFilters[field];
    this.listOrganizationMilestonesAsPage(this.lastLoadMilestonesTableEvent);
  }

  private cleanEmptyMilestonesFilters(
    filters: MilestoneFilter
  ): Partial<MilestoneFilter> {
    const cleanedFilters: Partial<MilestoneFilter> = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        cleanedFilters[key as keyof MilestoneFilter] = value;
      }
    });

    return cleanedFilters;
  }

  defineStateBadgeClass(
    status: string
  ): 'danger' | 'secondary' | 'info' | 'success' | 'warn' | 'contrast' {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'CLOSED':
        return 'info';
      default:
        return 'contrast';
    }
  }
}
