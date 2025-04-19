import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LayoutComponent } from './core/layout/layout.component';
import { SettingsComponent } from './features/settings/settings.component';
import { CredentialsComponent } from './features/credentials/credentials.component';
import { canActivateAuth } from './core/guards/auth.guard';
import { RoomsComponent } from './features/scrum-poker/rooms/rooms.component';
import { ScrumPokerRoomComponent } from './features/scrum-poker/scrum-poker-room/scrum-poker-room.component';
import { TasksComponent } from './features/tasks/tasks.component';

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
        path: 'scrum-poker/rooms',
        component: RoomsComponent,
      },

      {
        path: 'scrum-poker/rooms/:roomId',
        component: ScrumPokerRoomComponent,
      },
    ],
  },
];
