import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { User } from '../../features/login/models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // API base URL from environment
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/Auth/login`, { email, password })
      .pipe(
        tap(user => {
          // Store user details and jwt token in local storage to keep user logged in
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }),
        catchError((error: HttpErrorResponse) => {
          // Check if it's a 401 Unauthorized (invalid credentials)
          if (error.status === 401) {
            return throwError(() => 'Invalid email or password');
          }
          // For other errors
          return throwError(() => 'Login failed. Please try again later.');
        })
      );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  getAuthToken(): string | null {
    const currentUser = this.currentUserSubject.value;
    return currentUser?.token || null;
  }
}
