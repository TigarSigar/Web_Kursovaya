<script setup lang="ts">
import type { UserRole } from '@/types/entities'
import PublicNavbar from '@/components/layout/PublicNavbar.vue'
import SidebarNav from '@/components/layout/SidebarNav.vue'

defineProps<{
  role: UserRole
}>()
</script>

<template>
  <SidebarNav v-if="role === 'FLEET_MANAGER'" />
  <PublicNavbar v-else />
</template>
