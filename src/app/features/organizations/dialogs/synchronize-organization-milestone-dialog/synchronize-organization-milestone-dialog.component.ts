import { OrganizationsRestApiService } from './../../../../core/services/api/organizations-rest-api.service';
import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  NgModel,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Dialog } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ButtonModule } from 'primeng/button';
import { NgIf } from '@angular/common';
import { SynchronizeMilestoneModel } from '../../../../core/models/milestones/synchronize-milestone.model';
import { SnackBarService } from '../../../../core/services/snack-bar.service.service';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { DatePicker } from 'primeng/datepicker';

@Component({
  selector: 'app-synchronize-organization-milestone-dialog',
  imports: [
    Dialog,
    TranslateModule,
    ReactiveFormsModule,
    SelectModule,
    MatProgressSpinnerModule,
    ButtonModule,
    NgIf,
    ToggleSwitch,
    DatePicker,
    FormsModule,
  ],
  templateUrl: './synchronize-organization-milestone-dialog.component.html',
  styleUrl: './synchronize-organization-milestone-dialog.component.scss',
})
export class SynchronizeOrganizationMilestoneDialogComponent implements OnInit {
  @Input() isVisible: boolean = false;
  @Input() organization!: string;
  @Output() isSynchronizeMilestoneDialogOpened = new EventEmitter<boolean>();

  constructor(
    private organizationRestApiService: OrganizationsRestApiService,
    private snackBarService: SnackBarService,
    private translateService: TranslateService
  ) {}

  availableMilestones: { id: number; title: string }[] = [];
  isLoadingMilestones = true;
  availableFrequencies: { label: string; value: string }[] = [];
  availableWeekDays: { label: string; value: number }[] = [];

  private _synchronizeMilestoneFormBuilder = inject(FormBuilder);
  public synchronizeMilestoneForm = this._synchronizeMilestoneFormBuilder.group(
    {
      organization: [''],
      milestone: [{ id: 0, title: '' }, Validators.required],
      isAutoSync: [false],
      frequency: ['NONE', Validators.required],
      weekDay: [1, Validators.required],
      time: [new Date()],
    }
  );

  ngOnInit(): void {
    this.synchronizeMilestoneForm.patchValue({
      organization: this.organization,
    });
    this.synchronizeMilestoneForm.get('milestone')?.disable();
    this.listAvailableMilestones();
    this.configureAvailableFrequencies();
    this.configureAvailableWeekDays();
  }

  listAvailableMilestones() {
    this.isLoadingMilestones = true;
    this.organizationRestApiService
      .listAvailableMilestonesToSynchronize(this.organization)
      .subscribe((response) => {
        this.availableMilestones = response;
        this.isLoadingMilestones = false;

        if (this.availableMilestones.length > 0) {
          this.synchronizeMilestoneForm.get('milestone')?.enable();
        }
      });
  }

  onChangeFrequency() {
    this.synchronizeMilestoneForm
      .get('frequency')!
      .valueChanges.subscribe((value) => {
        const timeControl = this.synchronizeMilestoneForm.get('time');

        const shouldEnableTime =
          this.synchronizeMilestoneForm.get('isAutoSync')?.value &&
          (value === 'EVERY_DAY' || value === 'ONCE_A_WEEK');

        if (shouldEnableTime) {
          timeControl?.enable();
          timeControl?.setValidators([Validators.required]);
        } else {
          timeControl?.disable();
          timeControl?.clearValidators();
        }

        timeControl?.updateValueAndValidity();
      });
  }

  synchronizeMilestone() {
    if (this.synchronizeMilestoneForm.valid) {
      const body = this.synchronizeMilestoneForm
        .value as SynchronizeMilestoneModel;

      body.hours = body.time?.getHours();
      body.minutes = body.time?.getMinutes();
      body.isImporting = true;
      this.organizationRestApiService
        .synchronizeMilestone(this.organization, body)
        .subscribe({
          next: (response) => {
            this.snackBarService.openSnackBar(
              this.translateService.instant(
                'messages.SYNCHRONIZE_MILESTONE_MESSAGE_SUCCESS'
              )
            );
            this.closeDialog();
          },

          error: (error) => {
            console.error(error);
            this.snackBarService.openSnackBar(
              this.translateService.instant(
                'messages.SYNCHRONIZE_MILESTONE_MESSAGE_ERROR'
              )
            );
            this.closeDialog();
          },
        });
    }
  }

  closeDialog() {
    this.isVisible = false;
    this.isSynchronizeMilestoneDialogOpened.emit(false);
    this.synchronizeMilestoneForm.reset();
  }

  configureAvailableFrequencies() {
    this.availableFrequencies = [
      {
        label: this.translateService.instant('commons.EVERY_30_MINUTES'),
        value: 'EVERY_30_MINUTES',
      },
      {
        label: this.translateService.instant('commons.EVERY_HOUR'),
        value: 'EVERY_HOUR',
      },
      {
        label: this.translateService.instant('commons.EVERY_3_HOURS'),
        value: 'EVERY_3_HOURS',
      },
      {
        label: this.translateService.instant('commons.EVERY_6_HOURS'),
        value: 'EVERY_6_HOURS',
      },
      {
        label: this.translateService.instant('commons.EVERY_12_HOURS'),
        value: 'EVERY_12_HOURS',
      },
      {
        label: this.translateService.instant('commons.EVERY_DAY'),
        value: 'EVERY_DAY',
      },
      {
        label: this.translateService.instant('commons.ONCE_A_WEEK'),
        value: 'ONCE_A_WEEK',
      },
    ];
  }

  configureAvailableWeekDays() {
    this.availableWeekDays = [
      {
        label: this.translateService.instant('commons.SUNDAY'),
        value: 1,
      },
      {
        label: this.translateService.instant('commons.MONDAY'),
        value: 2,
      },
      {
        label: this.translateService.instant('commons.TUESDAY'),
        value: 3,
      },
      {
        label: this.translateService.instant('commons.WEDNESDAY'),
        value: 4,
      },
      {
        label: this.translateService.instant('commons.THURSDAY'),
        value: 5,
      },
      {
        label: this.translateService.instant('commons.FRIDAY'),
        value: 6,
      },
      {
        label: this.translateService.instant('commons.SATURDAY'),
        value: 7,
      },
    ];
  }
}
