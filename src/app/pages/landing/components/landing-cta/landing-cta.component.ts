import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-landing-cta',
  standalone: true,
  imports: [CommonModule, NzButtonModule],
  templateUrl: './landing-cta.component.html',
  styleUrl: './landing-cta.component.css'
})
export class LandingCtaComponent {
  @Output() goToLogin = new EventEmitter<void>();
}
