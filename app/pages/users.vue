<template>
  <LayoutContainer title="Users">
    <div>some stuff is going here</div>
  </LayoutContainer>
</template>

<script lang="ts" setup>
import type { User } from "~/types";

const defaultColumns = [
  {
    key: "id",
    label: "#",
  },
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
    key: "status",
    label: "Status",
    sortable: true,
  },
];
</script>
