<template>
  <UForm
    :validate="validate"
    :validate-on="['submit']"
    :state="state"
    class="space-y-4"
    @submit="onSubmit"
  >
    <UFormGroup label="Name" name="name">
      <UInput
        v-model="state.name"
        placeholder="John Doe"
        :autofocus="!props.isEditing"
      />
    </UFormGroup>

    <UFormGroup label="Email" name="email">
      <UInput
        v-model="state.email"
        type="email"
        placeholder="john.doe@example.com"
      />
    </UFormGroup>

    <UFormGroup label="Avatar" name="avatar">
      <UInput v-model="state.avatar" placeholder="https://myavatarpath.com" />
    </UFormGroup>

    <UFormGroup label="Status" name="status">
      <USelect
        v-model="state.status"
        :options="[
          { label: 'Active', value: 'active' },
          { label: 'Inactive', value: 'inactive' },
        ]"
      />
    </UFormGroup>

    <div class="flex justify-end gap-3">
      <UButton
        label="Cancel"
        color="gray"
        variant="ghost"
        @click="emit('close')"
      />
      <UButton type="submit" label="Save" color="black" :loading="loading" />
    </div>
  </UForm>
</template>

<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types";
import type { ApiResponse } from "~/types";

type FormState = {
  name: string;
  email: string;
  avatar: string;
  status?: string;
};

const emit = defineEmits(["close", "reload-data"]);
const props = defineProps<{
  isEditing: boolean;
  editingUser?: {
    id?: string;
    name?: string;
    email?: string;
    avatar?: string;
    status?: string;
  };
}>();

const state = reactive<FormState>({
  name: props.editingUser?.name ?? "",
  email: props.editingUser?.email ?? "",
  avatar: props.editingUser?.avatar ?? "",
  status: props.editingUser?.status ?? "",
});

const loading = ref(false);

const validate = (state: FormState): FormError[] => {
  const errors = [];
  if (!state.name)
    errors.push({ path: "name", message: "Please enter a name." });
  if (!state.email)
    errors.push({ path: "email", message: "Please enter an email." });
  if (!state.avatar)
    errors.push({ path: "name", message: "Please enter an Avatar URL." });
  if (!state.status)
    errors.push({ path: "status", message: "Please select a status." });
  return errors;
};

async function onSubmit(event: FormSubmitEvent<any>) {
  loading.value = true;

  const endpoint = props.isEditing
    ? `/api/users/${props.editingUser?.id}`
    : "/api/users";

  const method = props.isEditing ? "PUT" : "POST";

  try {
    const response: ApiResponse<User[]> = await $fetch(endpoint, {
      method,
      body: JSON.stringify(event.data),
    });

    if (response.success) {
      emit("close");
      emit("reload-data");
    } else {
      console.error(response);
    }
  } catch (e) {
    console.error("Unknown Error:", e);
  } finally {
    loading.value = false;
  }
}
</script>
