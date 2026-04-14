<script setup lang="ts">
import type { UserRole } from '@/types/entities'
import SidebarNav from '@/components/layout/SidebarNav.vue'
import TopBar from '@/components/layout/TopBar.vue'

defineProps<{
  role: UserRole
}>()
</script>

<template>
  <SidebarNav v-if="role === 'FLEET_MANAGER'" />
  <TopBar v-else />
</template>
