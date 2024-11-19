<script setup>
import { reactive, computed, onMounted } from "vue";
import axios from "axios";

// Reactive state
const state = reactive({
  interactions: [],
  isLoading: true,
  error: null,
  extraColumnVisibility: {
    showCampaignStartDate: false,
    showCampaignEndDate: false,
    showCampaignStatus: false,
    showContactPhone: false,
    showContactInteractionDuration: false,
  },
});

// Fetch interaction history
const fetchInteractions = async () => {
  state.isLoading = true;
  state.error = null;
  try {
    const response = await axios.get(
      "/api/index.php?route=interaction-history"
    );
    state.interactions = response.data.interactionHistory || [];
  } catch (error) {
    state.error = "Failed to fetch interaction history.";
    console.error(error);
  } finally {
    state.isLoading = false;
  }
};

// Columns configuration
const columns = [
  { key: "user_name", label: "User Name" },
  { key: "campaign_name", label: "Campaign Name" },
  {
    key: "campaign_start_date",
    label: "Campaign Start Date",
    visibility: () => state.extraColumnVisibility.showCampaignStartDate,
  },
  {
    key: "campaign_end_date",
    label: "Campaign End Date",
    visibility: () => state.extraColumnVisibility.showCampaignEndDate,
  },
  {
    key: "campaign_status",
    label: "Campaign Status",
    visibility: () => state.extraColumnVisibility.showCampaignStatus,
  },
  { key: "target_list_name", label: "Target List Name" },
  { key: "account_name", label: "Account Name" },
  { key: "contact_name", label: "Contact Name" },
  { key: "outcome", label: "Outcome" },
  { key: "contacted_at", label: "Contacted At" },
  { key: "next_contact_date", label: "Next Contact Date" },
  {
    key: "contact_phone",
    label: "Contact Phone",
    visibility: () => state.extraColumnVisibility.showContactPhone,
  },
  {
    key: "contact_interaction_duration",
    label: "Contact Interaction Duration",
    visibility: () =>
      state.extraColumnVisibility.showContactInteractionDuration,
  },
];

// Computed property for visible columns
const visibleColumns = computed(() =>
  columns.filter((column) => !column.visibility || column.visibility())
);

// Fetch data on mount
onMounted(fetchInteractions);
</script>

<template>
  <div class="w-[90vw] mx-auto py-6">
    <h1 class="text-2xl font-bold mb-4">Interaction History</h1>

    <!-- Toggle visibility checkboxes -->
    <div class="mb-4 space-y-2">
      <label
        v-for="(value, key) in state.extraColumnVisibility"
        :key="key"
        class="flex items-center"
      >
        <input
          type="checkbox"
          v-model="state.extraColumnVisibility[key]"
          class="mr-2"
        />
        <!-- använder key och tar bort show och lägger till space -->
        {{
          key
            .replace("show", "")
            .replace(/([A-Z])/g, " $1")
            .trim()
        }}
      </label>
    </div>

    <!-- Loading state -->
    <div v-if="state.isLoading" class="text-center py-4">Loading...</div>

    <!-- Error state -->
    <div v-else-if="state.error" class="text-red-500 py-4">
      {{ state.error }}
      <button
        @click="fetchInteractions"
        class="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600"
      >
        Retry
      </button>
    </div>

    <!-- Interaction Rows ##########################################-->
    <div v-else>
      <!-- Interaction container -->
      <div class="w-full">
        <!-- Header row -->
        <div
          class="grid font-bold bg-gray-200 p-4 rounded-t-lg"
          :style="{
            gridTemplateColumns: `repeat(${visibleColumns.length}, minmax(auto, 1fr))`,
          }"
        >
          <div
            v-for="column in visibleColumns"
            :key="column.key"
            class="header-cell text-sm"
          >
            {{ column.label }}
          </div>
        </div>

        <!-- Data rows -->
        <div v-for="interaction in state.interactions" :key="interaction.id">
          <!-- Main Row -->
          <div
            class="grid p-4 border-b"
            :style="{
              gridTemplateColumns: `repeat(${visibleColumns.length}, minmax(auto, 1fr))`,
            }"
          >
            <div
              v-for="column in visibleColumns"
              :key="column.key"
              class="col-span-1"
            >
              {{ interaction[column.key] || "N/A" }}
            </div>
          </div>

          <!-- Details Row -->
          <div
            class="bg-gray-100 p-4 border-b"
            :style="{
              gridColumn: `span ${visibleColumns.length}`,
            }"
          >
            <p>
              <strong>Interaction Notes:</strong>
              {{ interaction.contact_notes || "N/A" }}
            </p>
            <p>
              <strong>Campaign Description:</strong>
              {{ interaction.campaign_description || "N/A" }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header-cell {
  text-align: center;
  word-wrap: break-word; /* Allow words to break naturally */
  white-space: nowrap; /* Prevent text wrapping */
  overflow: hidden;
  text-overflow: ellipsis; /* Show "..." for overflowing text */
}
</style>
