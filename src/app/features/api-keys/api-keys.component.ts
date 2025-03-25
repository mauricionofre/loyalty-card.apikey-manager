import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AddKeyModalComponent } from './shared/add-key-modal/add-key-modal.component';
import { AuthService } from '../../core/services/auth.service';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  status: 'active' | 'expired';
  createdAt: Date;
  expiresAt: Date;
  createdBy: string;
}

@Component({
  selector: 'app-api-keys',
  standalone: true,
  imports: [
    CommonModule, 
    AddKeyModalComponent,
    MatIconModule
  ],
  templateUrl: './api-keys.component.html',
  styleUrls: ['./api-keys.component.scss']
})
export class ApiKeysComponent {
  showModal = false;
  modalMode: 'create' | 'edit' = 'create';
  selectedKey?: ApiKey;
  apiKeys: ApiKey[] = [
    {
      id: '1',
      name: 'Production Key',
      key: 'pk_live_123456789',
      status: 'active',
      createdAt: new Date(),
      expiresAt: new Date(2024, 11, 31),
      createdBy: 'John Doe'
    },
    {
      id: '2',
      name: 'Test Key',
      key: 'pk_test_987654321',
      status: 'active',
      createdAt: new Date(),
      expiresAt: new Date(2024, 5, 30),
      createdBy: 'Jane Smith'
    }
  ];

  constructor(private authService: AuthService) {}

  deleteKey(id: string) {
    // Aqui você implementará a lógica para deletar a chave
    this.apiKeys = this.apiKeys.filter(key => key.id !== id);
  }

  createKey(newKey: { name: string, expiresAt: string }) {
    this.authService.currentUser$.subscribe(currentUser => {
      const key: ApiKey = {
        id: Math.random().toString(36).substr(2, 9),
        name: newKey.name,
        key: 'pk_' + Math.random().toString(36).substr(2, 16),
        status: 'active',
        createdAt: new Date(),
        expiresAt: new Date(newKey.expiresAt),
        createdBy: currentUser?.email || 'Unknown User'
      };
      this.apiKeys = [...this.apiKeys, key];
    });
  }

  editKey(key: ApiKey) {
    this.modalMode = 'edit';
    this.selectedKey = key;
    this.showModal = true;
  }

  onEdit(updatedKey: { name: string }) {
    this.apiKeys = this.apiKeys.map(key => 
      key.id === this.selectedKey?.id 
        ? { ...key, name: updatedKey.name }
        : key
    );
    this.closeModal();
  }

  closeModal() {
    this.showModal = false;
    this.modalMode = 'create';
    this.selectedKey = undefined;
  }

  // Paginação
  pageSize = 5;
  currentPage = 1;

  get totalPages(): number {
    return Math.ceil(this.apiKeys.length / this.pageSize);
  }

  get paginatedKeys(): ApiKey[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.apiKeys.slice(startIndex, startIndex + this.pageSize);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}
