<template>
  <div
    class="mt-[-100px] w-screen h-screen flex justify-center items-center p-20 align-middle"
  >
    <div>
      Check your email inbox. You should have received a magic link to sign in.
    </div>
  </div>
</template>
<script setup lang="ts">
const user = useSupabaseUser();

// Get redirect path from cookies
const cookieName = useRuntimeConfig().public.supabase.cookieName;
const redirectPath = useCookie(`${cookieName}-redirect-path`).value;

watch(
  user,
  () => {
    if (user.value) {
      // Clear cookie
      useCookie(`${cookieName}-redirect-path`).value = null;
      // Redirect to path
      return navigateTo(redirectPath || "/");
    }
  },
  { immediate: true },
);
</script>
