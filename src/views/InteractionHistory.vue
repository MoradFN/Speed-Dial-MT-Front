<script setup>
import { reactive, onMounted } from "vue";
import axios from "axios";

const state = reactive({
  targetLists: [], // Store target list data
  isLoading: true, // Loading state
  error: null, // Error state
});

// Fetch target lists from API
const fetchTargetLists = async () => {
  state.isLoading = true;
  try {
    const response = await axios.get("/api/index.php?route=target-lists");
    state.targetLists = response.data.targetLists || []; // Adjust key based on API response
  } catch (error) {
    state.error = "Failed to fetch target lists.";
    console.error(error);
  } finally {
    state.isLoading = false;
  }
};

// Fetch data when component mounts
onMounted(fetchTargetLists);
</script>

<template>
  <div class="container mx-auto py-6">
    <h1 class="text-2xl font-bold mb-4">Target Lists</h1>

    <!-- Display loading state -->
    <div v-if="state.isLoading" class="text-center py-4">Loading...</div>

    <!-- Display error message -->
    <div v-else-if="state.error" class="text-red-500 py-4">
      {{ state.error }}
    </div>

    <!-- Display target list table -->
    <div v-else>
      <table class="table-auto w-full bg-white border rounded-lg shadow-md">
        <thead>
          <tr>
            <th class="px-4 py-2">ID</th>
            <th class="px-4 py-2">Name</th>
            <th class="px-4 py-2">Description</th>
            <th class="px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="list in state.targetLists" :key="list.id">
            <td class="px-4 py-2">{{ list.id }}</td>
            <td class="px-4 py-2">{{ list.name }}</td>
            <td class="px-4 py-2">{{ list.description }}</td>
            <td class="px-4 py-2">{{ list.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
