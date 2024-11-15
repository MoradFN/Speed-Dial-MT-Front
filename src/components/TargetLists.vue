<script setup>
import { RouterLink } from "vue-router";
import TargetList from "./TargetList.vue";
import { reactive, defineProps, onMounted } from "vue";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import axios from "axios";

defineProps({
  limit: Number,
  showButton: {
    type: Boolean,
    default: false,
  },
});

//MTTODO: BYT TILL ATT HÄMTA ALLA TARGETLISTS.
const state = reactive({
  targetLists: [],
  isLoading: true,
  error: null, // varför error: null
});

onMounted(async () => {
  try {
    const response = await axios.get("/api/index.php?route=target-lists");
    state.targetLists = response.data.targetLists || []; // || [] varför tom array
  } catch (error) {
    console.error("Error fetching target lists:", error);
    state.error = "Failed to load target lists. Please try again.";
  } finally {
    state.isLoading = false;
  }
});
</script>
<template>
  <section class="bg-blue-50 px-4 py-10">
    <div class="container-xl lg:container m-auto">
      <h2 class="text-3xl font-bold text-green-500 mb-6 text-center">
        Browse Target Lists
      </h2>
      <!-- Show loading spinner while loading is true -->
      <div v-if="state.isLoading" class="text-center text-gray-500 py-6">
        <PulseLoader />
      </div>

      <!-- Show error message -->
      <div v-if="state.error" class="text-center text-red-500 py-6">
        {{ state.error }}
      </div>

      <!-- Show limited target lists -->
      <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TargetList
          v-for="targetList in state.targetLists.slice(
            0,
            limit || state.targetLists.length
          )"
          :key="targetList.id"
          :targetList="targetList"
        />
      </div>
    </div>
  </section>

  <section v-if="showButton" class="m-auto max-w-lg my-10 px-6">
    <!-- MTTODO ändra /jobs -->
    <RouterLink
      to="/jobs"
      class="block bg-black text-white text-center py-4 px-6 rounded-xl hover:bg-gray-700"
      >View All Target Lists</RouterLink
    >
  </section>
</template>
