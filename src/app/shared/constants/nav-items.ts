import { NavItem } from '../../core/models/nav-item.model';

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    icon: 'dashboard',
    href: '/dashboard',
  },
  {
    label: 'Votação',
    icon: 'scoreboard',
    href: '/scrum-poker/rooms',
  },
  {
    label: 'Credenciais',
    icon: 'vpn_key',
    href: '/credentials',
  },
  {
    label: 'Configurações',
    icon: 'settings',
    href: '/settings',
  },
];
