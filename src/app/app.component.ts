import { UserRestApiService } from './core/services/api/user-rest-api.service';
import { UboardKeycloakService } from './core/services/uboard-keycloak.service';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet />`,
})
export class AppComponent implements OnInit {
  title = 'uboard';

  constructor(
    private uboardKeycloakService: UboardKeycloakService,
    private userRestApiService: UserRestApiService
  ) {}

  ngOnInit(): void {
    if (this.uboardKeycloakService.isAuthenticated()) {
      this.userRestApiService.syncUser();
    }
  }
}
