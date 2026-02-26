import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { AppLogoComponent } from '../../../../components/app-logo.component';

@Component({
  selector: 'app-notifications-header',
  standalone: true,
  imports: [
    CommonModule,
    NzIconModule,
    NzBadgeModule,
    NzAvatarModule,
    NzMenuModule,
    NzDropDownModule,
    AppLogoComponent
  ],
  templateUrl: './notifications-header.component.html',
  styleUrl: './notifications-header.component.css'
})
export class NotificationsHeaderComponent {
  @Input() isDarkMode = false;
  @Input() unreadCount$!: Observable<number>;

  @Output() toggleDarkMode = new EventEmitter<void>();
  @Output() navigateToProfile = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();
}
