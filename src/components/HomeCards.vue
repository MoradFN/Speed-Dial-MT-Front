<script setup>
import { RouterLink } from "vue-router";
import Card from "@/components/Card.vue";
</script>

<template>
  <section class="py-4">
    <div class="container-xl lg:container m-auto">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg">
        <Card>
          <h2 class="text-2xl font-bold">Target Lists</h2>
          <p class="mt-2 mb-4">Choose a target list to access Speed Dialer</p>
          <RouterLink
            to="/jobs"
            class="inline-block bg-black text-white rounded-lg px-4 py-2 hover:bg-gray-700"
          >
            Browse Target Lists
          </RouterLink>
        </Card>
        <Card bg="bg-green-100">
          <h2 class="text-2xl font-bold">Interaction History</h2>
          <p class="mt-2 mb-4">
            View and filter through the logged interactions
          </p>
          <RouterLink
            to="/jobs/add"
            class="inline-block bg-green-500 text-white rounded-lg px-4 py-2 hover:bg-green-600"
          >
            Browse Interactions
          </RouterLink>
        </Card>
      </div>
    </div>
  </section>
</template>
