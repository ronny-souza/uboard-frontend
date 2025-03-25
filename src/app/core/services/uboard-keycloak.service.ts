import Keycloak, { KeycloakProfile } from 'keycloak-js';
import { inject, Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UboardKeycloakService {
  private readonly keycloak = inject(Keycloak);

  isAuthenticated(): boolean {
    return this.keycloak?.authenticated || false;
  }

  logout() {
    this.keycloak.logout();
  }

  async getSessionUserProfileData(): Promise<KeycloakProfile> {
    return await this.keycloak.loadUserProfile();
  }

  async getSessionUser(): Promise<User> {
    const userProfile = await this.getSessionUserProfileData();
    return {
      id: userProfile.id || '',
      username: userProfile.username || '',
      email: userProfile.email || '',
      fullName: `${userProfile.firstName || ''} ${userProfile.lastName || ''}`,
      firstName: userProfile.firstName || '',
      lastName: userProfile.lastName || '',
      avatarUrl:
        `https://avatar.iran.liara.run/username?username=${userProfile.firstName}+${userProfile.lastName}` ||
        '',
    };
  }
}
