<template>
  <LayoutContainer title="Home">
    <ULandingGrid>
      <ULandingCard
        class="col-span-6"
        title="Bookings"
        description="View, update and delete upcoming bookings."
        icon="i-heroicons-calendar-days"
        color="primary"
        to="/bookings"
      />
      <ULandingCard
        class="col-span-6"
        title="Polls"
        description="Bulk upload the results of a poll and produce the fairest set
    of bookings that allow the most people to play."
        icon="i-heroicons-inbox-stack"
        color="primary"
        to="/polls"
      />
      <ULandingCard
        class="col-span-6"
        title="Users"
        description="View, update and delete users."
        icon="i-heroicons-users"
        color="primary"
        to="/users"
      />
      <ULandingCard
        class="col-span-6"
        title="Settings"
        description="Update your account settings and preferences here."
        icon="i-heroicons-cog"
        color="primary"
        to="/settings"
      />
    </ULandingGrid>
    <!-- <HomeChart :period="period" :range="range" /> -->
  </LayoutContainer>
</template>

<script lang="ts" setup>
// import { sub } from "date-fns";
// import type { Period, Range } from "~/types";
//
// const range = ref<Range>({
//   start: sub(new Date(), { days: 14 }),
//   end: new Date(),
// });
// const period = ref<Period>("daily");
</script>
