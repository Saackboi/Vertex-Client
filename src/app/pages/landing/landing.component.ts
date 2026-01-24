import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [NzButtonModule, NzIconModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  private readonly router = inject(Router);

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
