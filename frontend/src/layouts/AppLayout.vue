<script setup lang="ts">
import AppFooter from '@/components/layout/AppFooter.vue'
import type { UserRole } from '@/types/entities'
import RoleAwareNav from '@/components/layout/RoleAwareNav.vue'

defineProps<{
  role: UserRole
}>()
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <RoleAwareNav :role="role" />
    <main
      class="relative"
      :class="role === 'FLEET_MANAGER' ? 'lg:pl-72' : ''"
    >
      <div class="pointer-events-none absolute inset-0 overflow-hidden">
        <div class="absolute left-[-10%] top-[-8rem] h-72 w-72 rounded-full bg-primary/12 blur-3xl" />
        <div class="absolute bottom-0 right-[-8%] h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      </div>
      <div class="relative mx-auto max-w-7xl px-4 py-8 lg:px-8 lg:py-10">
        <slot />
      </div>
    </main>
    <AppFooter v-if="role === 'CLIENT'" />
  </div>
</template>
