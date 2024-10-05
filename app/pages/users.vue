<template>
  <LayoutContainer title="Users">
    <template #navbar-right>
      <UInput
        ref="input"
        v-model="q"
        icon="i-heroicons-funnel"
        autocomplete="off"
        placeholder="Filter users..."
        class="hidden lg:block"
        @keydown.esc="$event.target.blur()"
      >
        <template #trailing>
          <UKbd value="/" />
        </template>
      </UInput>

      <UButton
        label="New user"
        trailing-icon="i-heroicons-plus"
        color="gray"
        @click="isUserModalOpen = true"
      />
      <UButton
        v-if="selected.length === 1"
        label="Edit user"
        trailing-icon="i-heroicons-pencil"
        color="green"
        @click="isEditingUserModalOpen = true"
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

      <template #right>
        <USelectMenu
          v-model="selectedColumns"
          icon="i-heroicons-adjustments-horizontal-solid"
          :options="defaultColumns"
          multiple
          class="hidden lg:block"
        >
          <template #label> Display </template>
        </USelectMenu>
      </template>
    </UDashboardToolbar>

    <UDashboardModal
      v-model="isUserModalOpen"
      title="New user"
      description="Add a new user to your database"
      :ui="{ width: 'sm:max-w-lg' }"
    >
      <UsersForm @close="isUserModalOpen = false" :is-editing="false" />
    </UDashboardModal>
    <UDashboardModal
      v-model="isEditingUserModalOpen"
      title="Edit user"
      description="Edit a user in your database"
      :ui="{ width: 'sm:max-w-lg' }"
    >
      <UsersForm
        @close="isEditingUserModalOpen = false"
        @reload-data="loadData"
        :is-editing="true"
        :editing-user="{
          id: selected[0]?.id,
          name: selected[0]?.name,
          email: selected[0]?.email,
          avatar: selected[0]?.avatar ?? '',
          status: selected[0]?.status ?? '',
        }"
      />
    </UDashboardModal>
    <UTable
      v-model="selected"
      v-model:sort="sort"
      :rows="users"
      :columns="columns"
      :loading="loading"
      sort-mode="manual"
      class="w-full"
      :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }"
      @select="onSelect"
    >
      <template #name-data="{ row }">
        <div class="flex items-center gap-3">
          <UAvatar :src="row.avatar" :alt="row.name" size="xs" />
          <span class="text-gray-900 dark:text-white font-medium">{{
            row.name
          }}</span>
        </div>
      </template>

      <template #status-data="{ row }">
        <UBadge
          :label="row.status"
          :color="row.status === 'active' ? 'green' : 'red'"
          variant="subtle"
          class="capitalize"
        />
      </template>

      <template #created_at-data="{ row }">
        <span>{{ new Date(row.created_at).toLocaleString() }}</span>
      </template>

      <template #updated_at-data="{ row }">
        <span>{{ new Date(row.updated_at).toLocaleString() }}</span>
      </template>
    </UTable>
  </LayoutContainer>
</template>

<script lang="ts" setup>
import type { ApiResponse, User } from "~/types";

const defaultColumns = [
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
    key: "created_at",
    label: "Created At",
    sortable: true,
  },
  {
    key: "updated_at",
    label: "Last Updated",
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
const users = ref<User[]>([]);
const selected = ref<User[]>([]);
const selectedColumns = ref(defaultColumns);
const selectedStatuses = ref<string[]>([]);
const sort = ref({ column: "id", direction: "asc" as const });
const input = ref<{ input: HTMLInputElement }>();
const isUserModalOpen = ref(false);
const isEditingUserModalOpen = ref(false);

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
  const { data: usersFromDB } = await useFetch<ApiResponse<User[]>>(
    "/api/users",
    {
      query,
    },
  );
  if (usersFromDB.value?.success && usersFromDB.value?.data)
    users.value = usersFromDB.value.data;
  loading.value = false;
};

const defaultStatuses = users.value.reduce((acc, user) => {
  if (!acc.includes(user.status)) {
    acc.push(user.status);
  }
  return acc;
}, [] as string[]);

function onSelect(row: User) {
  const index = selected.value.findIndex((user) => user.id === row.id);
  if (index === -1) {
    selected.value.push(row);
  } else {
    selected.value.splice(index, 1);
  }
}

loadData();

defineShortcuts({
  "/": () => {
    input.value?.input?.focus();
  },
});
</script>
