import { Component, inject, OnDestroy, signal } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MediaMatcher } from '@angular/cdk/layout';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { NavItem } from '../../core/models/nav-item.model';
import { User } from '../../core/models/user.model';
import { UboardKeycloakService } from '../../core/services/uboard-keycloak.service';
import { NAV_ITEMS } from '../../shared/constants/nav-items';
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
  protected readonly isMobile = signal(true);
  private readonly _mobileQuery: MediaQueryList;
  private readonly _mobileQueryListener: () => void;

  protected readonly navItems = signal<NavItem[]>(NAV_ITEMS);

  readonly userInSessionData = signal<User | null>(null);
  private hasErrorGettingAvatarImage: boolean = false;

  constructor(private uboardKeycloakService: UboardKeycloakService) {
    const media = inject(MediaMatcher);

    this._mobileQuery = media.matchMedia('(max-width: 600px)');
    this.isMobile.set(this._mobileQuery.matches);
    this._mobileQueryListener = () => this.isMobile.set(this._mobileQuery.matches);
    this._mobileQuery.addEventListener('change', this._mobileQueryListener);
  }

  async ngOnInit() {
    if (this.uboardKeycloakService.isAuthenticated()) {
      const userData = await this.uboardKeycloakService.getSessionUser();
      this.userInSessionData.set(userData);
    }
  }

  ngOnDestroy(): void {
    this._mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }

  whenHasErrorGettingProfileImage() {
    this.hasErrorGettingAvatarImage = true;
  }

  hasErrorOnGetAvatarImage() {
    return this.hasErrorGettingAvatarImage;
  }

  logout() {
    this.uboardKeycloakService.logout();
  }
}
