import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

interface TokenConfig {
  clientUrl: string;
  expirationTime: number; // in minutes
}

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private apiUrl = `${environment.apiUrl}/tokens`;

  constructor(private http: HttpClient) {}

  getTokenConfig(): Observable<TokenConfig> {
    return this.http.get<TokenConfig>(this.apiUrl);
  }

  updateTokenConfig(config: TokenConfig): Observable<TokenConfig> {
    return this.http.put<TokenConfig>(this.apiUrl, config);
  }
}
