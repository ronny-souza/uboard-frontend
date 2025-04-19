import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { interval, Subject, switchMap, takeUntil, takeWhile } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { BadgeModule } from 'primeng/badge';
import { ProgressBar } from 'primeng/progressbar';
import { InputTextModule } from 'primeng/inputtext';
import { TasksRestApiService } from './../../core/services/api/tasks-rest-api.service';
import { UboardSpinnerComponent } from '../../shared/components/uboard-spinner/uboard-spinner.component';
import { UboardEmptyTableWarningComponent } from '../../shared/components/uboard-empty-table-warning/uboard-empty-table-warning.component';
import { UboardButtonWithIconComponent } from '../../shared/components/uboard-button-with-icon/uboard-button-with-icon.component';
import { UboardPageTitleComponent } from '../../shared/components/uboard-page-title/uboard-page-title.component';
import { TaskStatusEnum } from '../../core/models/tasks/task-status.enum';
import { TaskFilters } from '../../core/models/tasks/tasks-filter.model';
import { Task } from '../../core/models/tasks/task.model';

@Component({
  selector: 'app-tasks',
  imports: [
    RouterModule,
    TranslateModule,
    DatePipe,
    FormsModule,
    CardModule,
    ButtonModule,
    BadgeModule,
    ProgressBar,
    InputTextModule,
    TableModule,
    SelectModule,
    UboardSpinnerComponent,
    UboardEmptyTableWarningComponent,
    UboardButtonWithIconComponent,
    UboardPageTitleComponent,
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
})
export class TasksComponent implements OnDestroy {
  tasks: Task[] = [];
  totalElements = 0;
  pageSize = 5;
  isLoadingTasks = true;

  displayedColumns: string[] = [
    'operation',
    'progress',
    'status',
    'createdAt',
    'finishedAt',
  ];

  statuses: any[] = [
    { label: TaskStatusEnum.NONE, value: TaskStatusEnum.NONE },
    { label: TaskStatusEnum.CREATED, value: TaskStatusEnum.CREATED },
    { label: TaskStatusEnum.RUNNING, value: TaskStatusEnum.RUNNING },
    { label: TaskStatusEnum.FAILED, value: TaskStatusEnum.FAILED },
    { label: TaskStatusEnum.COMPLETED, value: TaskStatusEnum.COMPLETED },
  ];

  lastLoadTasksTableEvent: any;

  tasksTableFilters: TaskFilters = {
    status: TaskStatusEnum.NONE,
  };

  private destroy$ = new Subject<void>();

  constructor(private tasksRestApiService: TasksRestApiService) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  listTasksAsPage(event: any) {
    this.lastLoadTasksTableEvent = event;
    this.isLoadingTasks = true;
    this.tasks = [];
    this.totalElements = 0;
    const page = Math.floor(event.first / event.rows);
    const size = event.rows;
    this.pageSize = size;

    const filters = this.cleanEmptyFilters(this.tasksTableFilters);

    this.tasksRestApiService
      .listTasksAsPage(page, size, filters)
      .subscribe((response) => {
        this.tasks = response.content;
        this.totalElements = response.page.totalElements;
        this.isLoadingTasks = false;

        this.startPollingRunningTasks();
      });
  }

  getStatusByValue(value: string | null) {
    return this.statuses.find((s) => s.value === value) ?? null;
  }

  refreshTasksTable() {
    this.listTasksAsPage(this.lastLoadTasksTableEvent);
  }

  hasItems() {
    return this.tasks.length > 0;
  }

  startPollingRunningTasks() {
    this.tasks
      .filter(
        (task) =>
          task.status === TaskStatusEnum.RUNNING ||
          task.status === TaskStatusEnum.CREATED
      )
      .forEach((task) => {
        interval(3000)
          .pipe(
            takeUntil(this.destroy$),
            switchMap(() =>
              this.tasksRestApiService.pollTaskProgress(task.uuid)
            ),
            takeWhile(
              (taskProgress) =>
                taskProgress.status === TaskStatusEnum.RUNNING ||
                taskProgress.status === TaskStatusEnum.CREATED,
              true
            ),
            takeUntil(this.destroy$)
          )
          .subscribe((taskProgress) => {
            this.tasks = this.tasks.map((t) =>
              t.uuid === task.uuid
                ? {
                    ...t,
                    progress: taskProgress.progress,
                    status: taskProgress.status,
                  }
                : t
            );
          });
      });
  }

  defineStatusBadgeClass(
    status: TaskStatusEnum
  ): 'danger' | 'secondary' | 'info' | 'success' | 'warn' | 'contrast' {
    switch (status) {
      case TaskStatusEnum.COMPLETED:
        return 'success';
      case TaskStatusEnum.RUNNING:
        return 'info';
      case TaskStatusEnum.FAILED:
        return 'danger';
      case TaskStatusEnum.CREATED:
        return 'warn';
      default:
        return 'contrast';
    }
  }

  updateFilter<K extends keyof TaskFilters>(field: K, value: TaskFilters[K]) {
    if (value && value !== TaskStatusEnum.NONE && value.length > 0) {
      this.tasksTableFilters[field] = value;
    } else {
      delete this.tasksTableFilters[field];
    }

    this.listTasksAsPage(this.lastLoadTasksTableEvent);
  }

  clearFilter<K extends keyof TaskFilters>(field: K) {
    delete this.tasksTableFilters[field];
    this.listTasksAsPage(this.lastLoadTasksTableEvent);
  }

  private cleanEmptyFilters(filters: TaskFilters): Partial<TaskFilters> {
    const cleanedFilters: Partial<TaskFilters> = {};

    Object.entries(filters).forEach(([key, value]) => {
      if (
        value !== '' &&
        value !== null &&
        value !== undefined &&
        value !== TaskStatusEnum.NONE
      ) {
        cleanedFilters[key as keyof TaskFilters] = value;
      }
    });

    return cleanedFilters;
  }
}
