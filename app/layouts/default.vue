<template>
  <UDashboardLayout>
    <UDashboardPanel
      :width="300"
      :resizeable="{ min: 200, max: 400 }"
      collapsible
    >
      <UDashboardNavbar>
        <template #left>
          <Logo />
        </template>
      </UDashboardNavbar>
      <UDashboardSidebar>
        <Navigation />
        <template #footer>
          <UsersDropdown />
        </template>
      </UDashboardSidebar>
    </UDashboardPanel>
    <NuxtPage />
  </UDashboardLayout>
</template>

<script setup lang="ts"></script>
