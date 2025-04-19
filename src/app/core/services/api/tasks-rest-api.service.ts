import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page } from '../../models/page.model';
import { Task } from '../../models/tasks/task.model';
import { TaskProgress } from '../../models/tasks/task-progress.model';
import { TaskFilters } from '../../models/tasks/tasks-filter.model';

@Injectable({
  providedIn: 'root',
})
export class TasksRestApiService {
  private readonly baseUrl: string = `${environment.uboardApiUrl}/tasks`;

  constructor(private httpClient: HttpClient) {}

  listTasksAsPage(
    page: number,
    size: number,
    filters: TaskFilters = {}
  ): Observable<Page<Task>> {
    let params = new HttpParams().set('page', page).set('size', size);

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params = params.set(key, value.toString());
      }
    });

    return this.httpClient.get<Page<Task>>(this.baseUrl, { params });
  }

  pollTaskProgress(uuid: string): Observable<TaskProgress> {
    return this.httpClient.get<TaskProgress>(
      `${this.baseUrl}/${uuid}/progress`
    );
  }
}
