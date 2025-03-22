import { Component } from '@angular/core';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { MainContentComponent } from './layout/main-content/main-content.component';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatIconModule, HeaderComponent, SidebarComponent, MainContentComponent, RouterOutlet],
  template: `
    @if (isAuthenticated) {
      <app-header />
      <app-sidebar />
      <app-main-content />
    } @else {
      <router-outlet />
    }
  `,
  styles: [`
    :host {
      display: block;
      height: 100vh;
    }
  `]
})
export class AppComponent {
  constructor(private authService: AuthService) {}

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
}
