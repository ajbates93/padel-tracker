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
        <div class="flex items-center gap-5">
          <USelectMenu
            v-model="selectedStatuses"
            icon="i-heroicons-check-circle"
            placeholder="Status"
            multiple
            :options="defaultStatuses"
            :ui-menu="{ option: { base: 'capitalize' } }"
          />
          <UToggle id="pastBookings" v-model="displayPastBookings" />
          <label
            class="hover cursor-pointer select-none text-sm"
            for="pastBookings"
            >Show previous bookings</label
          >
        </div>
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
    <UDashboardModal
      v-model="isBookingParticipantModalOpen"
      title="Add participant"
      description="Add a participant to your booking. You can add up to 4 participants."
      :ui="{ width: 'sm:max-w-md' }"
    >
      <BookingsParticipantsForm
        v-if="selected.length > 0"
        :bookingId="selected[0]!.id"
        @close="isBookingParticipantModalOpen = false"
        :is-editing="false"
      />
    </UDashboardModal>
    <UDashboardModal
      v-model="isEditingBookingParticipantModalOpen"
      title="Edit participant"
      description="Edit the selected user or change whether the user has paid."
      :ui="{ width: 'sm:max-w-md' }"
    >
      <BookingsParticipantsForm
        :bookingId="selected[0]!.id"
        @close="isEditingBookingParticipantModalOpen = false"
        @reload-data="loadData"
        :is-editing="true"
        :editing-booking-participant="{
          id: selectedParticipant!.id,
          user_id: selectedParticipant!.userId,
          paid: selectedParticipant!.paid,
        }"
      />
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
      <template #owner-data="{ row }">
        <div v-if="row.owner" class="flex items-center gap-3">
          <UAvatar :src="row.owner.avatar" :alt="row.owner.name" size="xs" />
          <span class="text-gray-900 dark:text-white font-medium">{{
            row.owner.name
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
        <div class="pb-5">
          <UTable :columns="participantColumns" :rows="row.participants">
            <template #name-data="{ row }">
              <div v-if="row.user" class="flex items-center gap-3">
                <UAvatar
                  :src="row.user.avatar"
                  :alt="row.user.name"
                  size="xs"
                />
                <span class="text-gray-900 dark:text-white font-medium">{{
                  row.user.name
                }}</span>
              </div>
            </template>

            <template #email-data="{ row }">
              <div v-if="row.user.email">{{ row.user.email }}</div>
            </template>

            <template #paid-data="{ row }">
              <div>{{ row.paid ? "Yes" : "No" }}</div>
            </template>

            <template #actions-data="{ row }">
              <UDropdown :items="participantActions(row)">
                <UButton
                  color="gray"
                  variant="ghost"
                  icon="i-heroicons-ellipsis-horizontal-20-solid"
                />
              </UDropdown>
            </template>
          </UTable>
          <template v-if="row.participants.length < 4">
            <UButton
              class="mt-5"
              label="Add participant"
              trailing-icon="i-heroicons-plus"
              color="gray"
              @click="isBookingParticipantModalOpen = true"
            />
          </template>
        </div>
      </template>
    </UTable>
  </LayoutContainer>
</template>

<script lang="ts" setup>
import type { ApiResponse, Booking } from "~/types";

const defaultColumns = [
  { key: "owner", label: "Booking User" },
  { key: "date", label: "Date", sortable: true },
  { key: "time", label: "Time" },
  { key: "duration", label: "Session Length" },
  { key: "status", label: "Status" },
];

const participantColumns = [
  {
    key: "name",
    label: "Name",
    sortable: false,
  },
  {
    key: "email",
    label: "Email",
    sortable: false,
  },
  {
    key: "paid",
    label: "Paid",
    sortable: false,
  },
  {
    key: "actions",
    label: "Actions",
    sortable: false,
  },
];

const participantActions = (row: any) => [
  [
    {
      label: "Edit",
      icon: "i-heroicons-pencil-20-solid",
      click: () => {
        handleEditParticipant(row.id, row.user.id, row.paid);
      },
    },
  ],
  [
    {
      label: "Remove",
      icon: "i-heroicons-trash-20-solid",
      click: () => {
        isRemoveBookingParticipantModalOpen.value = true;
      },
    },
  ],
];

const q = ref("");
const loading = ref(false);
const bookings = ref<Booking[]>([]);
const selected = ref<Booking[]>([]);
const selectedParticipant = ref<{
  id: number;
  userId: string;
  paid: boolean;
} | null>(null);
const selectedColumns = ref(defaultColumns);
const selectedStatuses = ref<string[]>([]);
const sort = ref<{ column: string; direction: "desc" | "asc" }>({
  column: "date",
  direction: "asc",
});
const input = ref<{ input: HTMLInputElement }>();
const isBookingModalOpen = ref(false);
const isBookingParticipantModalOpen = ref(false);
const isEditingBookingParticipantModalOpen = ref(false);
const isRemoveBookingParticipantModalOpen = ref(false);

const displayPastBookings = ref(false);

const columns = computed(() =>
  defaultColumns.filter((column) => selectedColumns.value.includes(column)),
);

const query = computed(() => ({
  q: q.value,
  where: displayPastBookings.value ? "all" : "future",
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
  if (bookingsFromDb.value?.success && bookingsFromDb.value?.data) {
    bookings.value = bookingsFromDb.value.data;
  }

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

function handleEditParticipant(
  participantId: number,
  userId: string,
  paid: boolean,
) {
  selectedParticipant.value = {
    id: participantId,
    userId: userId,
    paid,
  };
  isEditingBookingParticipantModalOpen.value = true;
}

loadData();

watch(
  [q, displayPastBookings, selectedStatuses, sort, displayPastBookings],
  loadData,
  {
    deep: true,
  },
);

defineShortcuts({
  "/": () => input.value?.input?.focus(),
});
</script>
