<template>
  <UDashboardLayout>
    <UDashboardPanel
      :width="300"
      :resizeable="{ min: 200, max: 400 }"
      collapsible
    >
      <UDashboardNavbar>
        <template #left>
          <div class="text-2xl font-bold flex items-center">
            <UIcon name="i-heroicons-calendar-days" class="mr-2" />Padel Tracker
          </div>
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
