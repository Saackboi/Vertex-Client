import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { OnboardingExperienceListComponent } from '../onboarding-experience-list/onboarding-experience-list.component';
import { OnboardingExperienceModalComponent } from '../onboarding-experience-modal/onboarding-experience-modal.component';
import { OnboardingSkillsSectionComponent } from '../onboarding-skills-section/onboarding-skills-section.component';

@Component({
  selector: 'app-onboarding-step-experience',
  standalone: true,
  imports: [
    CommonModule,
    NzAlertModule,
    OnboardingExperienceListComponent,
    OnboardingExperienceModalComponent,
    OnboardingSkillsSectionComponent
  ],
  templateUrl: './onboarding-step-experience.component.html',
  styleUrl: './onboarding-step-experience.component.css'
})
export class OnboardingStepExperienceComponent {
  @Input() experienceForm!: FormGroup;
  @Input() experiences!: FormArray;
  @Input() experienceModalForm?: FormGroup;
  @Input() isExperienceModalVisible = false;
  @Input() skills: string[] = [];
  @Input() isLoading$!: Observable<boolean>;
  @Input() hasError!: (formGroup: FormGroup, fieldName: string) => boolean;
  @Input() getErrorMessage!: (formGroup: FormGroup, fieldName: string) => string;

  @Output() addExperience = new EventEmitter<void>();
  @Output() openExperienceModal = new EventEmitter<number | undefined>();
  @Output() removeExperience = new EventEmitter<number>();
  @Output() addSkill = new EventEmitter<KeyboardEvent>();
  @Output() removeSkill = new EventEmitter<string>();
  @Output() saveAndContinue = new EventEmitter<void>();
  @Output() previousStep = new EventEmitter<void>();
  @Output() closeExperienceModal = new EventEmitter<void>();
  @Output() saveExperienceModal = new EventEmitter<void>();
}
