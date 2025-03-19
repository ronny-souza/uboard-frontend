import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LayoutComponent } from './core/layout/layout.component';
import { SettingsComponent } from './features/settings/settings.component';
import { CredentialsComponent } from './features/credentials/credentials.component';
import { canActivateAuthRole } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [canActivateAuthRole],
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
        path: 'settings',
        component: SettingsComponent,
      },

      {
        path: 'credentials',
        component: CredentialsComponent,
      },
    ],
  },
];
