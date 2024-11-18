<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

// State
const targetLists = ref([]);
const isLoading = ref(true);
const errorMessage = ref("");

// Fetch target lists on component mount
onMounted(async () => {
  try {
    const response = await axios.get("/api/index.php?route=target-lists");
    console.log(response.data);

    targetLists.value = response.data.targetLists || [];
  } catch (error) {
    errorMessage.value = "Failed to load target lists. Please try again.";
    console.error("Error fetching target lists:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>

<template>
  <div>
    <h1>Target Lists</h1>

    <!-- Loading Spinner -->
    <div v-if="isLoading">Loading target lists...</div>

    <!-- Error Message -->
    <div v-if="errorMessage">{{ errorMessage }}</div>

    <!-- Target Lists -->
    <div v-else>
      <div v-if="targetLists.length === 0">No target lists available.</div>
      <ul v-else>
        <li v-for="target in targetLists" :key="target.id">
          <h3>{{ target.name }}</h3>
          <p>{{ target.description }}</p>
          <p><strong>Status:</strong> {{ target.status }}</p>
          <p>
            <strong>Completion Status:</strong> {{ target.completion_status }}%
          </p>
          <p><strong>Campaign:</strong> {{ target.campaign_name }}</p>
          <p><strong>Assigned To:</strong> {{ target.assigned_to }}</p>
          <p><strong>Created At:</strong> {{ target.created_at }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
h1 {
  text-align: center;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  border: 1px solid #ddd;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
}
</style>
