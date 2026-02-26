import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-onboarding-experience-list',
  standalone: true,
  imports: [CommonModule, NzIconModule],
  templateUrl: './onboarding-experience-list.component.html',
  styleUrl: './onboarding-experience-list.component.css'
})
export class OnboardingExperienceListComponent {
  @Input() experiences!: FormArray;

  @Output() addExperience = new EventEmitter<void>();
  @Output() openExperienceModal = new EventEmitter<number | undefined>();
  @Output() removeExperience = new EventEmitter<number>();
}
