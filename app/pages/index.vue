<template>
  <LayoutContainer title="Home">
    <HomeChart :period="period" :range="range" />
  </LayoutContainer>
</template>

<script lang="ts" setup>
import { sub } from "date-fns";
import type { Period, Range } from "~/types";

const range = ref<Range>({
  start: sub(new Date(), { days: 14 }),
  end: new Date(),
});
const period = ref<Period>("daily");
</script>
