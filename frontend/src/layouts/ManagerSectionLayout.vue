<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppLayout from '@/layouts/AppLayout.vue'
</script>

<template>
  <AppLayout role="FLEET_MANAGER">
    <RouterView />
  </AppLayout>
</template>
