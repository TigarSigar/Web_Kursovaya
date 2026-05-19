import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '@/pages/auth/LoginPage.vue'
import RegisterPage from '@/pages/auth/RegisterPage.vue'
import AvailableCarsPage from '@/pages/client/AvailableCarsPage.vue'
import RentalCreatePage from '@/pages/client/RentalCreatePage.vue'
import MyRentalsPage from '@/pages/client/MyRentalsPage.vue'
import RentalDetailsPage from '@/pages/client/RentalDetailsPage.vue'
import CarFormPage from '@/pages/manager/CarFormPage.vue'
import CarsManagementPage from '@/pages/manager/CarsManagementPage.vue'
import MaintenanceFormPage from '@/pages/manager/MaintenanceFormPage.vue'
import MaintenanceManagementPage from '@/pages/manager/MaintenanceManagementPage.vue'
import ManagerDashboardPage from '@/pages/manager/ManagerDashboardPage.vue'
import RentalProcessingPage from '@/pages/manager/RentalProcessingPage.vue'
import RentalsManagementPage from '@/pages/manager/RentalsManagementPage.vue'
import TariffFormPage from '@/pages/manager/TariffFormPage.vue'
import TariffsManagementPage from '@/pages/manager/TariffsManagementPage.vue'
import PublicHomePage from '@/pages/public/PublicHomePage.vue'
import AccountPage from '@/pages/shared/AccountPage.vue'
import ForbiddenPage from '@/pages/shared/ForbiddenPage.vue'
import NotFoundPage from '@/pages/shared/NotFoundPage.vue'
import ClientSectionLayout from '@/layouts/ClientSectionLayout.vue'
import ManagerSectionLayout from '@/layouts/ManagerSectionLayout.vue'
import PublicLayout from '@/layouts/PublicLayout.vue'
import { pinia } from '@/app/stores'
import { useAuthStore } from '@/app/stores/auth'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    roles?: Array<'CLIENT' | 'FLEET_MANAGER'>
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: PublicLayout,
      children: [
        { path: '', component: PublicHomePage },
        { path: 'cars', component: AvailableCarsPage },
      ],
    },
    { path: '/login', component: LoginPage },
    { path: '/register', component: RegisterPage },
    { path: '/forbidden', component: ForbiddenPage },
    {
      path: '/client',
      component: ClientSectionLayout,
      meta: { requiresAuth: true, roles: ['CLIENT'] },
      children: [
        { path: '', redirect: '/' },
        { path: 'account', component: AccountPage },
        { path: 'search', component: AvailableCarsPage },
        { path: 'rentals', component: MyRentalsPage },
        { path: 'rentals/new', component: RentalCreatePage },
        { path: 'rentals/:id', component: RentalDetailsPage },
      ],
    },
    {
      path: '/manager',
      component: ManagerSectionLayout,
      meta: { requiresAuth: true, roles: ['FLEET_MANAGER'] },
      children: [
        { path: '', component: ManagerDashboardPage },
        { path: 'account', component: AccountPage },
        { path: 'cars', component: CarsManagementPage },
        { path: 'cars/new', component: CarFormPage },
        { path: 'cars/:id/edit', component: CarFormPage },
        { path: 'tariffs', component: TariffsManagementPage },
        { path: 'tariffs/new', component: TariffFormPage },
        { path: 'tariffs/:id/edit', component: TariffFormPage },
        { path: 'maintenance', component: MaintenanceManagementPage },
        { path: 'maintenance/new', component: MaintenanceFormPage },
        { path: 'maintenance/:id/edit', component: MaintenanceFormPage },
        { path: 'rentals', component: RentalsManagementPage },
        { path: 'rentals/:id', component: RentalProcessingPage },
      ],
    },
    { path: '/:pathMatch(.*)*', component: NotFoundPage },
  ],
})

router.beforeEach((to) => {
  const authStore = useAuthStore(pinia)

  if (to.path === '/login' && authStore.isAuthenticated) {
    return authStore.userRole === 'FLEET_MANAGER' ? '/manager' : '/'
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return '/login'
  }

  if (to.meta.roles?.length && authStore.userRole && !to.meta.roles.includes(authStore.userRole)) {
    return '/forbidden'
  }

  return true
})

export { router }
