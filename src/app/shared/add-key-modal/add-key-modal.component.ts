import { Component, EventEmitter, Output } from '@angular/core';
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
export class AddKeyModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() create = new EventEmitter<NewApiKey>();

  newKey: NewApiKey = {
    name: '',
    expiresAt: ''
  };

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    this.create.emit(this.newKey);
    this.onClose();
  }
}
