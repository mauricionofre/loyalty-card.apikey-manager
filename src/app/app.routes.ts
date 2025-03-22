import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { LoginComponent } from './features/login/login.component';
import { ApiKeysComponent } from './features/api-keys/api-keys.component';
import { loggedInGuard } from './core/guards/logged-in.guard';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent,
    canActivate: [loggedInGuard]
  },
  { 
    path: '', 
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'keys', component: ApiKeysComponent },
      // outras rotas protegidas aqui
    ]
  },
  { path: '**', redirectTo: '' }
];
