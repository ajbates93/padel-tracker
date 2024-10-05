<template>
  <UForm
    :validate="validate"
    :validate-on="['submit']"
    :state="state"
    class="space-y-4"
    @submit="onSubmit"
  >
    <div class="flex justify-between gap-3">
      <div>Select booking date:</div>
      <UPopover :popper="{ placement: 'bottom-start' }">
        <UButton
          icon="i-heroicons-calendar-days-20-solid"
          :label="date.toLocaleDateString()"
        />
        <template #panel="{ close }">
          <DatePicker v-model="date" is-required @close="close" />
        </template>
      </UPopover>
    </div>

    <UFormGroup label="Time" name="time">
      <USelect v-model="state.time" :options="timeOptions" />
    </UFormGroup>

    <UFormGroup label="Duration" name="duration">
      <USelect
        v-model="state.duration"
        :options="[
          { label: '60 minutes', value: 60 },
          { label: '90 minutes', value: 90 },
        ]"
      />
    </UFormGroup>

    <UFormGroup label="Status" name="status">
      <USelect
        v-model="state.status"
        :options="[
          { label: 'Pending', value: 'pending' },
          { label: 'Confirmed', value: 'confirmed' },
          { label: 'Cancelled', value: 'cancelled' },
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

type FormState = {
  date: Date;
  time: string;
  duration: number;
  status: string;
};

const emit = defineEmits(["close", "reload-data"]);
const props = defineProps<{
  isEditing: boolean;
  editingBooking?: {
    id?: string;
    date: Date;
    time: string;
    duration: number;
    status: string;
  };
}>();

const date = ref(new Date());

const state = reactive<FormState>({
  date: props.editingBooking?.date ?? new Date(),
  time: props.editingBooking?.time ?? "",
  duration: props.editingBooking?.duration ?? 60,
  status: props.editingBooking?.status ?? "pending",
});

const loading = ref(false);

const validate = (state: FormState): FormError[] => {
  const errors = [];
  if (!state.date)
    errors.push({ path: "date", message: "Please enter a date." });

  return errors;
};

function generateTimeOptions() {
  const options = [];
  const start = 6 * 60; // 06:00 in minutes
  const end = 22 * 60; // 22:00 in minutes
  const interval = 30; // 30 minutes

  for (let mins = start; mins <= end; mins += interval) {
    const hours = Math.floor(mins / 60);
    const minutes = mins % 60;
    const time = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    options.push({ label: time, value: time });
  }

  return options;
}

const timeOptions = computed(() => generateTimeOptions());

type ApiResponse = {
  success: boolean;
  data?: any;
  error?: string;
};

async function onSubmit(event: FormSubmitEvent<any>) {
  loading.value = true;

  const endpoint = props.isEditing
    ? `/api/bookings/${props.editingBooking?.id}`
    : "/api/bookings";

  const method = props.isEditing ? "PUT" : "POST";

  try {
    const response: ApiResponse = await $fetch(endpoint, {
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
