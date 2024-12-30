<template>
  <UForm
    :validate="validate"
    :validate-on="['submit']"
    :state="state"
    class="space-y-4"
    @submit="onSubmit"
  >
    <UFormGroup label="User" name="user">
      <USelect v-model="state.user_id" :options="userOptions" />
    </UFormGroup>

    <UFormGroup label="Paid" name="paid">
      <UToggle v-model="state.paid" />
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
import type { ApiResponse, BookingParticipant } from "~/types";

const { data: users } = useFetch<ApiResponse<User[]>>("/api/users");

const userOptions = computed(() => {
  if (!users.value || !users.value.data) return [];
  return users.value.data.map((user: User) => ({
    label: user.name,
    value: user.id,
  }));
});

type FormState = {
  user_id: string;
  paid: boolean;
};

const emit = defineEmits(["close", "reload-data"]);
const props = defineProps<{
  isEditing: boolean;
  editingBookingParticipant?: {
    id?: number;
    user_id: string;
    paid: boolean;
  };
  bookingId: number;
}>();

const state = reactive<FormState>({
  user_id: props.editingBookingParticipant?.user_id ?? "",
  paid: props.editingBookingParticipant?.paid ?? false,
});

const loading = ref(false);

const validate = (state: FormState): FormError[] => {
  const errors = [];
  if (!state.user_id)
    errors.push({ path: "date", message: "Please select a user." });

  return errors;
};

async function onSubmit(event: FormSubmitEvent<any>) {
  loading.value = true;

  const endpoint = props.isEditing
    ? `/api/bookingParticipants/${props.editingBookingParticipant?.id}`
    : "/api/bookingParticipants";

  const method = props.isEditing ? "PUT" : "POST";

  const bookingParticipantInput = {
    booking_id: props.bookingId,
    ...event.data,
  };

  try {
    const response: ApiResponse<BookingParticipant[]> = await $fetch(endpoint, {
      method,
      body: JSON.stringify(bookingParticipantInput),
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
