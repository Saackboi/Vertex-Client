import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-landing-features',
  standalone: true,
  imports: [CommonModule, NzIconModule],
  templateUrl: './landing-features.component.html',
  styleUrl: './landing-features.component.css'
})
export class LandingFeaturesComponent {}
