import { useUser } from "~/composables/useUser";

export default defineNuxtRouteMiddleware((to, from) => {
  console.log("Auth middleware", to.path, from.path);
  // Fetch the user
  const user = useUser();

  // These routes are public
  const publicRoutes = ["/", "/login", "/confirm", "/signup"];
  const loginRoutes = ["/login", "/confirm", "/signup"];

  if (publicRoutes.includes(to.path)) return;

  if (loginRoutes.includes(to.path) && user.value) {
    return navigateTo("/");
  }

  // Redirect to login if user is not logged in
  if (!user.value && !publicRoutes.includes(to.path)) {
    return navigateTo("/login");
  }
});
