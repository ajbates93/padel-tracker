<template>
  <LayoutContainer title="Bookings">
    <template #navbar-right>
      <UInput
        ref="input"
        v-model="q"
        icon="i-heroicons-funnel"
        autocomplete="off"
        placeholder="Filter bookings..."
        class="hidden lg:block"
        @keydown.esc="$event.target.blur()"
      >
        <template #trailing>
          <UKbd value="/" />
        </template>
      </UInput>

      <UButton
        label="New booking"
        trailing-icon="i-heroicons-plus"
        color="gray"
        @click="isNewBookingModalOpen = true"
      />
    </template>
    <UDashboardToolbar>
      <template #left>
        <USelectMenu
          v-model="selectedStatuses"
          icon="i-heroicons-check-circle"
          placeholder="Status"
          multiple
          :options="defaultStatuses"
          :ui-menu="{ option: { base: 'capitalize' } }"
        />
      </template>
    </UDashboardToolbar>
    <UDashboardModal
      v-model="isNewBookingModalOpen"
      title="New booking"
      description="Add a new booking to your database"
      :ui="{ width: 'sm:max-w-md' }"
    >
      <!-- <UsersForm @close="isNewBookingModalOpen = false" /> -->
    </UDashboardModal>
    <UTable
      v-model="selected"
      v-model:sort="sort"
      :rows="bookings"
      :columns="columns"
      :loading="pending"
      sort-mode="manual"
      class="w-full"
      :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }"
      @select="onSelect"
    >
      <template #bookingUser-data="{ row }">
        <div v-if="row.bookingUser" class="flex items-center gap-3">
          <UAvatar
            v-bind="row.bookingUser.avatar"
            :alt="row.bookingUser.name"
            size="xs"
          />
          <span class="text-gray-900 dark:text-white font-medium">{{
            row.bookingUser.name
          }}</span>
        </div>
      </template>

      <template #status-data="{ row }">
        <UBadge
          :label="row.bookingStatus"
          :color="
            row.bookingStatus === 'confirmed'
              ? 'green'
              : row.bookingStatus === 'pending'
                ? 'orange'
                : 'red'
          "
          variant="subtle"
          class="capitalize"
        />
      </template>
    </UTable>
  </LayoutContainer>
</template>

<script lang="ts" setup>
import type { Booking } from "~/types";

const defaultColumns = [
  { value: "id", label: "#" },
  { value: "bookingUser", label: "Name" },
  { value: "bookingDate", label: "Date", sortable: true },
  { value: "bookingTime", label: "Time" },
  { value: "bookingDuration", label: "Session Length" },
  { value: "bookingStatus", label: "Status" },
  { value: "bookingParticipants", label: "Participants" },
];

const q = ref("");
const selected = ref<Booking[]>([]);
const selectedColumns = ref(defaultColumns);
const selectedStatuses = ref<string[]>([]);
const sort = ref({ column: "bookingDate", direction: "desc" });
const input = ref<{ input: HTMLInputElement }>();
const isNewBookingModalOpen = ref(false);

const columns = computed(() =>
  defaultColumns.filter((column) => selectedColumns.value.includes(column)),
);

const query = computed(() => ({
  q: q.value,
  statuses: selectedStatuses.value,
  sort: sort.value.column,
  order: sort.value.direction,
}));

const { data: bookings, pending } = await useFetch<Booking[]>("/api/bookings", {
  query,
  default: () => [],
});

console.log(bookings);

const defaultStatuses = bookings.value.reduce((acc, booking) => {
  if (!acc.includes(booking.bookingStatus)) {
    acc.push(booking.bookingStatus);
  }
  return acc;
}, [] as string[]);

function onSelect(row: Booking) {
  const index = selected.value.findIndex((booking) => booking.id === row.id);
  if (index === -1) {
    selected.value.push(row);
  } else {
    selected.value.splice(index, 1);
  }
}

defineShortcuts({
  "/": () => input.value?.input?.focus(),
});
</script>
