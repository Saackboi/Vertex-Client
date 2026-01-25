import { Component, Input } from '@angular/core';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { Router } from '@angular/router';
import { NavigationUtils } from '../core/utils/navigation.utils';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [NzIconModule],
  template: `
    <div class="form-logo"
         style="
           cursor:pointer;
           display: flex;
           align-items: center;
           justify-content: center;
           gap: 0.6rem;
           margin: 2.0rem auto 2rem auto;
           width: fit-content;
         "
         (click)="navigate()">
      <div class="logo-icon" style="width: 48px; height: 48px; border-radius: 12px; background: #43A047; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 22px; box-shadow: 0 10px 30px rgba(67,160,71,0.22);">
        <span nz-icon nzType="rocket" nzTheme="outline" style="font-size: 2rem;"></span>
      </div>
      <span class="logo-text" style="font-size: 1.25rem; font-weight: 800; letter-spacing: 0.08em; color: #0f172a;">VERTEX</span>
    </div>
  `,
  styleUrls: []
})
export class AppLogoComponent {
  @Input() route: string = '/dashboard';
  constructor(private router: Router) {}
  navigate() {
    NavigationUtils.goTo(this.router, this.route);
  }
}
