import { Component, inject, OnDestroy, signal } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import Keycloak from 'keycloak-js';
import { NavItem } from '../../core/models/nav-item.model';
import { User } from '../../core/models/user.model';
@Component({
  selector: 'app-sidenav',
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    RouterModule,
    MatButtonModule,
    MatMenuModule,
  ],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss',
})
export class SidenavComponent implements OnDestroy {
  protected readonly navItems = signal<NavItem[]>([
    {
      label: 'Dashboard',
      icon: 'dashboard',
      href: '/dashboard',
    },

    {
      label: 'Votação',
      icon: 'scoreboard',
      href: '/scrum-poker/rooms',
    },

    {
      label: 'Credenciais',
      icon: 'vpn_key',
      href: '/credentials',
    },

    {
      label: 'Configurações',
      icon: 'settings',
      href: '/settings',
    },
  ]);

  protected readonly isMobile = signal(true);

  private readonly _mobileQuery: MediaQueryList;
  private readonly _mobileQueryListener: () => void;

  private readonly keycloak = inject(Keycloak);
  readonly userInSessionData = signal<User | null>(null);

  private hasErrorGettingAvatarImage: boolean = false;

  constructor() {
    const media = inject(MediaMatcher);

    this._mobileQuery = media.matchMedia('(max-width: 600px)');
    this.isMobile.set(this._mobileQuery.matches);
    this._mobileQueryListener = () =>
      this.isMobile.set(this._mobileQuery.matches);
    this._mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  async ngOnInit() {
    if (this.keycloak?.authenticated) {
      const userProfile = await this.keycloak.loadUserProfile();
      this.userInSessionData.set({
        username: userProfile.username || '',
        email: userProfile.email || '',
        fullName: `${userProfile.firstName || ''} ${
          userProfile.lastName || ''
        }`,
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        avatarUrl: `https://avatar.iran.liara.run/username?username=${userProfile.firstName}+${userProfile.lastName}` || '',
      });
    }
  }


  ngOnDestroy(): void {
    this._mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }

  whenHasErrorGettingProfileImage() {
    this.hasErrorGettingAvatarImage = true;
  }

  hasErrorOnGetAvatarImage () {
    return this.hasErrorGettingAvatarImage;
  }

  logout() {
    this.keycloak.logout();
  }
}
