<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar :title="props.title"></UDashboardNavbar>
      <UDashboardPanelContent>
        <slot />
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<script lang="ts" setup>
const props = defineProps<{
  title: string;
}>();
</script>
