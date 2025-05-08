import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page } from '../../models/page.model';
import { OrganizationFilter } from '../../models/organizations/organization-filter.model';
import { OrganizationModel } from '../../models/organizations/organization.model';
import { CreateOrganizationModel } from '../../models/organizations/create-organization.model';
import { MilestoneFilter } from '../../models/milestones/milestone-filter.model';
import { MilestoneModel } from '../../models/milestones/milestone.model';
import { UnsynchronizedMilestoneModel } from '../../models/milestones/unsynchronized-milestone.model';
import { SynchronizeMilestoneModel } from '../../models/milestones/synchronize-milestone.model';
import { Task } from '../../models/tasks/task.model';

@Injectable({
  providedIn: 'root',
})
export class OrganizationsRestApiService {
  private readonly baseUrl: string = `${environment.uboardApiUrl}/organizations`;

  constructor(private httpClient: HttpClient) {}

  getSingleOrganization(uuid: string): Observable<OrganizationModel> {
    return this.httpClient.get<OrganizationModel>(`${this.baseUrl}/${uuid}`);
  }

  listOrganizationsAsPage(
    page: number,
    size: number,
    filters: OrganizationFilter = {}
  ): Observable<Page<OrganizationModel>> {
    let params = new HttpParams().set('page', page).set('size', size);

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params = params.set(key, value.toString());
      }
    });

    return this.httpClient.get<Page<OrganizationModel>>(this.baseUrl, {
      params,
    });
  }

  listOrganizationMilestonesAsPage(
    organizationId: string,
    page: number,
    size: number,
    filters: MilestoneFilter = {}
  ): Observable<Page<MilestoneModel>> {
    let params = new HttpParams().set('page', page).set('size', size);

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params = params.set(key, value.toString());
      }
    });

    return this.httpClient.get<Page<MilestoneModel>>(
      `${this.baseUrl}/${organizationId}/milestones`,
      {
        params,
      }
    );
  }

  listAvailableMilestonesToSynchronize(
    organizationId: string
  ): Observable<UnsynchronizedMilestoneModel[]> {
    return this.httpClient.get<UnsynchronizedMilestoneModel[]>(
      `${this.baseUrl}/${organizationId}/discover-milestones`
    );
  }

  createOrganization(
    body: CreateOrganizationModel
  ): Observable<OrganizationModel> {
    return this.httpClient.post<OrganizationModel>(this.baseUrl, body);
  }

  synchronizeMilestone(
    organizationId: string,
    body: SynchronizeMilestoneModel
  ): Observable<Task> {
    return this.httpClient.post<Task>(
      `${this.baseUrl}/${organizationId}/synchronize-milestone`,
      body
    );
  }
}
