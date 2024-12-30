<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar :title="props.title">
        <template #right>
          <slot name="navbar-right"></slot>
        </template>
      </UDashboardNavbar>
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
