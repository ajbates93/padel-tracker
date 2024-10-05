<template>
  <UForm
    :validate="validate"
    :validate-on="['submit']"
    :state="state"
    class="space-y-4"
    @submit="onSubmit"
  >
    <UFormGroup label="Name" name="name">
      <UInput v-model="state.name" placeholder="John Doe" autofocus />
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

const emit = defineEmits(["close"]);

type FormState = {
  name: string;
  email: string;
  avatar: string;
};

const state = reactive<FormState>({
  name: "",
  email: "",
  avatar: "",
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
  return errors;
};

async function onSubmit(event: FormSubmitEvent<any>) {
  try {
    loading.value = true;

    const response = await $fetch("/api/users", {
      method: "POST",
      body: JSON.stringify(event.data),
    });

    if (response.success) {
      emit("close");
    } else {
      console.error(response);
    }
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }

  emit("close");
}
</script>
