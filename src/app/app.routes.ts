import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LayoutComponent } from './core/layout/layout.component';
import { SettingsComponent } from './features/settings/settings.component';
import { CredentialsComponent } from './features/credentials/credentials.component';
import { canActivateAuth } from './core/guards/auth.guard';
import { ScrumPokerRoomComponent } from './features/scrum-poker/scrum-poker-room/scrum-poker-room.component';
import { TasksComponent } from './features/tasks/tasks.component';
import { OrganizationsComponent } from './features/organizations/organizations.component';
import { OrganizationDetailsComponent } from './features/organizations/organization-details/organization-details.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [canActivateAuth],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'organizations',
        component: OrganizationsComponent,
      },
      {
        path: 'organizations/:organizationId',
        component: OrganizationDetailsComponent,
      },
      {
        path: 'credentials',
        component: CredentialsComponent,
      },
      {
        path: 'tasks',
        component: TasksComponent,
      },
      {
        path: 'settings',
        component: SettingsComponent,
      },
      {
        path: 'organizations/:organizationId/milestones/:milestoneId/scrum-poker-rooms/:roomId',
        component: ScrumPokerRoomComponent,
      },
    ],
  },
];
