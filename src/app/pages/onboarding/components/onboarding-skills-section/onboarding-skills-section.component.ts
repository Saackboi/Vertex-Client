import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-onboarding-skills-section',
  standalone: true,
  imports: [CommonModule, NzIconModule],
  templateUrl: './onboarding-skills-section.component.html',
  styleUrl: './onboarding-skills-section.component.css'
})
export class OnboardingSkillsSectionComponent {
  @Input() experienceForm!: FormGroup;
  @Input() skills: string[] = [];
  @Input() isLoading$!: Observable<boolean>;

  @Output() addSkill = new EventEmitter<Event | KeyboardEvent | HTMLInputElement>();
  @Output() removeSkill = new EventEmitter<string>();
  @Output() saveAndContinue = new EventEmitter<void>();
  @Output() previousStep = new EventEmitter<void>();
}
