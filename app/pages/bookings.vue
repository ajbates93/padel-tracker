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
        @click="isBookingModalOpen = true"
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
      v-model="isBookingModalOpen"
      title="New booking"
      description="Add a new booking to your database"
      :ui="{ width: 'sm:max-w-md' }"
    >
      <BookingsForm @close="isBookingModalOpen = false" :is-editing="false" />
    </UDashboardModal>
    <UTable
      v-model="selected"
      v-model:sort="sort"
      :rows="bookings"
      :columns="columns"
      :loading="loading"
      sort-mode="manual"
      class="w-full"
      :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }"
      @select="onSelect"
    >
      <template #user_id-data="{ row }">
        <div v-if="row.user" class="flex items-center gap-3">
          <UAvatar v-bind="row.user.avatar" :alt="row.user.name" size="xs" />
          <span class="text-gray-900 dark:text-white font-medium">{{
            row.user.name
          }}</span>
        </div>
      </template>

      <template #date-data="{ row }">
        <span>{{ new Date(row.date).toLocaleDateString() }}</span>
      </template>

      <template #status-data="{ row }">
        <UBadge
          :label="row.status"
          :color="
            row.status === 'confirmed'
              ? 'green'
              : row.status === 'pending'
                ? 'orange'
                : 'red'
          "
          variant="subtle"
          class="capitalize"
        />
      </template>

      <template #expand="{ row, expanded, toggle }">
        <div>
          <UTable :columns="participantColumns" :rows="row.bookingParticipants">
            <template #name-data="{ row }">
              <div v-if="row.name" class="flex items-center gap-3">
                <UAvatar v-bind="row.avatar" :alt="row.name" size="xs" />
                <span class="text-gray-900 dark:text-white font-medium">{{
                  row.name
                }}</span>
              </div>
            </template>
          </UTable>
        </div>
      </template>
    </UTable>
  </LayoutContainer>
</template>

<script lang="ts" setup>
import type { ApiResponse, Booking } from "~/types";

const defaultColumns = [
  { key: "user", label: "Booking User" },
  { key: "date", label: "Date", sortable: true },
  { key: "time", label: "Time" },
  { key: "duration", label: "Session Length" },
  { key: "status", label: "Status" },
];

const participantColumns = [
  {
    key: "name",
    label: "Name",
    sortable: true,
  },
  {
    key: "email",
    label: "Email",
    sortable: true,
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
  },
];

const q = ref("");
const loading = ref(false);
const bookings = ref<Booking[]>([]);
const selected = ref<Booking[]>([]);
const selectedColumns = ref(defaultColumns);
const selectedStatuses = ref<string[]>([]);
const sort = ref<{ column: string; direction: "desc" | "asc" }>({
  column: "date",
  direction: "desc",
});
const input = ref<{ input: HTMLInputElement }>();
const isBookingModalOpen = ref(false);

const columns = computed(() =>
  defaultColumns.filter((column) => selectedColumns.value.includes(column)),
);

const query = computed(() => ({
  q: q.value,
  statuses: selectedStatuses.value,
  sort: sort.value.column,
  order: sort.value.direction,
}));

const loadData = async () => {
  loading.value = true;
  const { data: bookingsFromDb } = await useFetch<ApiResponse<Booking[]>>(
    "/api/bookings",
    {
      query,
    },
  );
  if (bookingsFromDb.value?.success && bookingsFromDb.value?.data)
    bookings.value = bookingsFromDb.value.data;
  loading.value = false;
};

const defaultStatuses = bookings.value.reduce((acc, booking) => {
  if (!acc.includes(booking.status)) {
    acc.push(booking.status);
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

loadData();

defineShortcuts({
  "/": () => input.value?.input?.focus(),
});
</script>
