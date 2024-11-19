<script setup>
import { reactive, onMounted } from "vue";
import axios from "axios";

// Reactive state for interaction history
const state = reactive({
  interactions: [], // Fetched interaction history
  isLoading: true, // Loading state
  error: null, // Error state
});

// Fetch interaction history from API
const fetchInteractions = async () => {
  state.isLoading = true;
  try {
    const response = await axios.get(
      "/api/index.php?route=interaction-history"
    );
    state.interactions = response.data.interactionHistory || []; // Populate interactions or fallback to empty array
  } catch (error) {
    state.error = "Failed to fetch interaction history."; // Handle API error
    console.error(error);
  } finally {
    state.isLoading = false; // End loading state
  }
};

// Fetch data on component mount
onMounted(fetchInteractions);
</script>

<template>
  <div class="container mx-auto py-6">
    <h1 class="text-2xl font-bold mb-4">Interaction History</h1>

    <!-- Loading state -->
    <div v-if="state.isLoading" class="text-center py-4">Loading...</div>

    <!-- Error state -->
    <div v-else-if="state.error" class="text-red-500 py-4">
      {{ state.error }}
    </div>

    <!-- Interaction table -->
    <div v-else>
      <table class="table-auto w-full bg-white border rounded-lg shadow-md">
        <thead>
          <tr>
            <th class="px-4 py-2">User Name</th>
            <th class="px-4 py-2">Campaign Name</th>
            <th class="px-4 py-2">Contact Name</th>
            <th class="px-4 py-2">Contacted At</th>
            <th class="px-4 py-2">Outcome</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="interaction in state.interactions" :key="interaction.id">
            <td class="px-4 py-2">{{ interaction.user_name }}</td>
            <td class="px-4 py-2">{{ interaction.campaign_name }}</td>
            <td class="px-4 py-2">{{ interaction.contact_name }}</td>
            <td class="px-4 py-2">{{ interaction.contact_contacted_at }}</td>
            <td class="px-4 py-2">
              {{ interaction.contact_interaction_outcome }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
