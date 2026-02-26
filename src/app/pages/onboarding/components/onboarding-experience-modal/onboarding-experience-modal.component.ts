import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-onboarding-experience-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NzModalModule, NzIconModule, NzButtonModule],
  templateUrl: './onboarding-experience-modal.component.html',
  styleUrl: './onboarding-experience-modal.component.css'
})
export class OnboardingExperienceModalComponent {
  @Input() experienceModalForm?: FormGroup;
  @Input() isExperienceModalVisible = false;
  @Input() hasError!: (formGroup: FormGroup, fieldName: string) => boolean;
  @Input() getErrorMessage!: (formGroup: FormGroup, fieldName: string) => string;

  @Output() closeExperienceModal = new EventEmitter<void>();
  @Output() saveExperienceModal = new EventEmitter<void>();
}
