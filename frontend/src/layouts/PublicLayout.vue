<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppFooter from '@/components/layout/AppFooter.vue'
import PublicNavbar from '@/components/layout/PublicNavbar.vue'
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <PublicNavbar />
    <RouterView />
    <AppFooter />
  </div>
</template>
