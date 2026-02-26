import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { AppLogoComponent } from '../../../../components/app-logo.component';

@Component({
  selector: 'app-landing-header',
  standalone: true,
  imports: [
    CommonModule,
    NzButtonModule,
    NzIconModule,
    NzAvatarModule,
    NzMenuModule,
    NzDropDownModule,
    AppLogoComponent
  ],
  templateUrl: './landing-header.component.html',
  styleUrl: './landing-header.component.css'
})
export class LandingHeaderComponent {
  @Input() isDarkMode = false;
  @Input() isAuthenticated$!: Observable<boolean>;
  @Input() userFullName$!: Observable<string>;

  @Output() toggleTheme = new EventEmitter<void>();
  @Output() goToOnboarding = new EventEmitter<void>();
  @Output() goToLogin = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();
}
