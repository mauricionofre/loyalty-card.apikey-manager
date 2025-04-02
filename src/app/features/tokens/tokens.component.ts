import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TokenService } from './services/token.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface TokenConfig {
  clientUrl: string;
  expirationTime: number; // in minutes
}

@Component({
  selector: 'app-tokens',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSnackBarModule
  ],
  templateUrl: './tokens.component.html',
  styleUrls: ['./tokens.component.scss']
})
export class TokensComponent implements OnInit {
  tokenForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private tokenService: TokenService,
    private snackBar: MatSnackBar
  ) {
    this.tokenForm = this.fb.group({
      clientUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
      expirationTime: ['', [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.loadTokenConfig();
  }

  loadTokenConfig(): void {
    this.isLoading = true;
    this.tokenService.getTokenConfig().subscribe({
      next: (config) => {
        this.tokenForm.patchValue({
          clientUrl: config.clientUrl,
          expirationTime: config.expirationTime
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Failed to load token configuration', 'Close', {
          duration: 3000
        });
        this.isLoading = false;
      }
    });
  }

  saveTokenConfig(): void {
    if (this.tokenForm.invalid) {
      return;
    }

    const tokenConfig: TokenConfig = {
      clientUrl: this.tokenForm.get('clientUrl')?.value,
      expirationTime: this.tokenForm.get('expirationTime')?.value
    };

    this.isLoading = true;
    this.tokenService.updateTokenConfig(tokenConfig).subscribe({
      next: () => {
        this.snackBar.open('Token configuration updated successfully', 'Close', {
          duration: 3000
        });
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Failed to update token configuration', 'Close', {
          duration: 3000
        });
        this.isLoading = false;
      }
    });
  }
}
