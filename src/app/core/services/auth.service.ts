import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../features/login/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Mock users data
  private readonly mockUsers: User[] = [
    { id: 1, email: 'admin@example.com', password: 'admin123', token: 'mock-jwt-token-1' },
    { id: 2, email: 'user@example.com', password: 'user123', token: 'mock-jwt-token-2' }
  ];

  constructor() {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(email: string, password: string): Observable<User> {
    // Simulate API call delay
    return new Observable(subscriber => {
      setTimeout(() => {
        const user = this.mockUsers.find(u => u.email === email && u.password === password);
        
        if (user) {
          // Clone user object and remove password for security
          const userResponse = { ...user };
          delete userResponse.password;
          
          localStorage.setItem('currentUser', JSON.stringify(userResponse));
          this.currentUserSubject.next(userResponse);
          subscriber.next(userResponse);
        } else {
          subscriber.error('Invalid email or password');
        }
        subscriber.complete();
      }, 1000); // Simulate 1 second delay
    });
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
