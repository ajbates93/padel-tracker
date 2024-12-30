<template>
  <UDropdown
    class="w-full"
    mode="hover"
    :items="items"
    :ui="{
      width: 'w-full',
      item: { disabled: 'cursor-text select-text' },
    }"
    :popper="{
      placement: 'top',
      strategy: 'absolute',
    }"
  >
    <template #default="{ open }">
      <UButton
        color="gray"
        variant="ghost"
        class="w-full"
        label="Alex Bates"
        :class="[open && 'bg-gray-50 dark:bg-gray-800']"
      >
        <template #leading>
          <UAvatar
            src="https://avatars.githubusercontent.com/u/739984?v=4"
            size="2xs"
          />
        </template>

        <template #trailing>
          <UIcon name="i-heroicons-ellipsis-vertical" class="w-5 h-5 ml-auto" />
        </template>
      </UButton>
    </template>
    <template #account>
      <div class="text-left">
        <p>Signed in as</p>
        <p class="truncate font-medium text-gray-900 dark:text-white">
          Alex Bates
        </p>
      </div>
    </template>
  </UDropdown>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient();

const items = computed(() => {
  return [
    [
      {
        slot: "account",
        label: "",
        disabled: true,
      },
    ],
    [
      {
        label: "Settings",
        icon: "i-heroicons-cog-8-tooth",
        to: "/settings",
      },
    ],
    [
      {
        label: "Sign Out",
        icon: "i-heroicons-arrow-left-end-on-rectangle",
        click: () => {
          handleSignOutClick();
        },
      },
    ],
  ];
});

const handleSignOutClick = async () => {
  await supabase.auth.signOut();
  navigateTo("/");
};
</script>
