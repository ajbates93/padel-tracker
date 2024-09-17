<template>
  <UDashboardSidebarLinks :links="links"> </UDashboardSidebarLinks>
</template>

<script lang="ts" setup>
const links = [
  {
    label: "Dashboard",
    icon: "i-heroicons-home",
    to: "/",
  },
  {
    label: "Users",
    icon: "i-heroicons-users",
    to: "/users",
  },

  {
    label: "Help",
    icon: "i-heroicons-question-mark-circle",
    to: "/help",
  },
];
</script>
