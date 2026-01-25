import {
  BellOutline,
  UserOutline,
  HomeOutline,
  CalendarOutline,
  TagsOutline,
  IdcardOutline,
  EditOutline,
  GoogleOutline,
  LockOutline,
  MailOutline,
  TeamOutline,
  GlobalOutline,
  InfoCircleOutline,
  CheckCircleOutline,
  CloseCircleOutline
} from '@ant-design/icons-angular/icons';

// Crea alias compatibles con nombres antiguos con sufijo "-o"
function alias(def: any, aliasName: string): any {
  return { ...def, name: aliasName } as any;
}

export const outlineAliases: any[] = [
  alias(BellOutline, 'bell-o'),
  alias(UserOutline, 'user-o'),
  alias(HomeOutline, 'home-o'),
  alias(CalendarOutline, 'calendar-o'),
  alias(TagsOutline, 'tags-o'),
  alias(IdcardOutline, 'idcard-o'),
  alias(EditOutline, 'edit-o'),
  alias(GoogleOutline, 'google-o'),
  alias(LockOutline, 'lock-o'),
  alias(MailOutline, 'mail-o'),
  alias(TeamOutline, 'team-o'),
  alias(GlobalOutline, 'global-o'),
  alias(InfoCircleOutline, 'info-circle-o'),
  alias(CheckCircleOutline, 'check-circle-o'),
  alias(CloseCircleOutline, 'close-circle-o')
];
