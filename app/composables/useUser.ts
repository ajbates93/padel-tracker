import type { User } from "@supabase/supabase-js";

export const useUser = () => {
  const supabase = useSupabaseClient();
  const user = ref<User | null>(null);

  onMounted(async () => {
    // Fetch the user on mount
    const { data } = await supabase.auth.getUser();

    if (data) user.value = data.user;
  });

  return user;
};
