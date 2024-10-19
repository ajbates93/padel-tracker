<template>
  <div
    class="mt-[-100px] w-screen h-screen flex justify-center items-center p-20 align-middle"
  >
    <UAuthForm
      title="Sign in"
      description="Enter your email to receive a magic link in your inbox."
      icon="i-heroicons-user-circle"
      :validate="validate"
      :loading="false"
      :fields="fields"
      @submit="onSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import type { FormError } from "#ui/types";

definePageMeta({
  layout: "basic",
});

const supabase = useSupabaseClient();
const email = ref<string>("");

const fields = [
  {
    type: "email",
    label: "Email",
    name: "email",
    placeholder: "Enter your email",
  },
];

const validate = (state: { email: string; password: string }) => {
  const errors: FormError[] = [];
  if (!state.email)
    errors.push({ path: "email", message: "Email is required" });
  //if (!state.password)
  //  errors.push({ path: "password", message: "Password is required" });

  return errors;
};

const onSubmit = (data: any) => {
  email.value = data.email;
  signInWithOtp();
};

const signInWithOtp = async () => {
  const { error } = await supabase.auth.signInWithOtp({
    email: email.value,
    options: {
      emailRedirectTo: "http://localhost:3000/",
    },
  });
  if (!error) {
    // Redirect to confirm page
    return navigateTo("/confirm");
  } else {
    console.log(error);
  }
};
</script>
