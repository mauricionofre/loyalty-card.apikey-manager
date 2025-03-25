import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface NewApiKey {
  name: string;
  expiresAt: string;
}

@Component({
  selector: 'app-add-key-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-key-modal.component.html',
  styleUrls: ['./add-key-modal.component.scss']
})
export class AddKeyModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() create = new EventEmitter<NewApiKey>();

  newKey: NewApiKey = {
    name: '',
    expiresAt: ''
  };

  minExpiryDate: string = '';

  ngOnInit(): void {
    const today = new Date();
    const thirtyDaysLater = new Date(today);
    thirtyDaysLater.setDate(today.getDate() + 30);
    this.minExpiryDate = this.formatDateForInput(thirtyDaysLater);
    this.newKey.expiresAt = this.minExpiryDate;
  }
  
  formatDateForInput(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  isValidDate(): boolean {
    const selectedDate = new Date(this.newKey.expiresAt);
    const minDate = new Date(this.minExpiryDate);
    return selectedDate >= minDate;
  }

  isValidName(): boolean {
    return this.newKey.name.trim().length >= 3;
  }

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    if (!this.isValidDate() || !this.isValidName()) {
      return;
    }
    this.create.emit(this.newKey);
    this.onClose();
  }
}
