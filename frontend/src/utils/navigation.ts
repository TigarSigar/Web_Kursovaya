import type { UserRole } from '@/types/entities'

export interface NavItem {
  labelKey: string
  to: string
  icon: string
  roles: UserRole[]
}

export const navigationItems: NavItem[] = [
  { labelKey: 'nav.home', to: '/', icon: 'House', roles: ['CLIENT'] },
  { labelKey: 'nav.cars', to: '/cars', icon: 'Search', roles: ['CLIENT'] },
  { labelKey: 'nav.myRentals', to: '/client/rentals', icon: 'ClipboardList', roles: ['CLIENT'] },
  { labelKey: 'nav.dashboard', to: '/manager', icon: 'LayoutDashboard', roles: ['FLEET_MANAGER'] },
  { labelKey: 'nav.cars', to: '/manager/cars', icon: 'Car', roles: ['FLEET_MANAGER'] },
  { labelKey: 'nav.tariffs', to: '/manager/tariffs', icon: 'BadgeRussianRuble', roles: ['FLEET_MANAGER'] },
  { labelKey: 'nav.maintenance', to: '/manager/maintenance', icon: 'Wrench', roles: ['FLEET_MANAGER'] },
  { labelKey: 'nav.rentals', to: '/manager/rentals', icon: 'ClipboardCheck', roles: ['FLEET_MANAGER'] },
]
