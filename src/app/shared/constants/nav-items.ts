import { NavItem } from '../../core/models/nav-item.model';

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'DASHBOARD',
    icon: 'dashboard',
    href: '/dashboard',
  },
  {
    label: 'ORGANIZATIONS',
    icon: 'inventory_2',
    href: '/organizations',
  },
  {
    label: 'VOTING',
    icon: 'scoreboard',
    href: '/scrum-poker/rooms',
  },
  {
    label: 'CREDENTIALS',
    icon: 'vpn_key',
    href: '/credentials',
  },
  {
    label: 'TASKS',
    icon: 'notifications',
    href: '/tasks',
  },
  {
    label: 'SETTINGS',
    icon: 'settings',
    href: '/settings',
  },
];
