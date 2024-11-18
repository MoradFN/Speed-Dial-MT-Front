<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import axios from "axios";

// Reactive state for interaction history
const state = reactive({
  interactions: [], // Fetched interaction history
  totalPages: 1,
  totalRecords: 0,
  page: 1,
  limit: 5,
  orderBy: "contact_contacted_at",
  direction: "DESC",
  filters: {
    user_name: "",
    campaign_name: "",
    campaign_status: "",
    target_list_name: "",
    account_name: "",
    contact_name: "",
    contact_phone: "",
    contact_interaction_outcome: "",
    date_field: "contact_contacted_at",
    date_from: "",
    date_to: "",
  },
  isLoading: true,
  error: null,
});

// Fetch data from the backend
const fetchInteractions = async () => {
  state.isLoading = true;
  state.error = null;

  try {
    const params = {
      page: state.page,
      limit: state.limit,
      orderBy: state.orderBy,
      direction: state.direction,
      ...state.filters,
    };

    const response = await axios.get(
      "/api/index.php?route=interaction-history",
      {
        params,
      }
    );

    const data = response.data;
    state.interactions = data.interactionHistory || [];
    state.totalPages = data.totalPages || 1;
    state.totalRecords = data.totalRecords || 0;
  } catch (error) {
    state.error = "Failed to load interaction history. Please try again.";
    console.error(error);
  } finally {
    state.isLoading = false;
  }
};

// Fetch data on component mount
onMounted(fetchInteractions);

// Watch for changes to pagination or filters
watch(
  [() => state.page, () => state.orderBy, () => state.filters],
  fetchInteractions
);

// Handle sorting
const sortBy = (column) => {
  if (state.orderBy === column) {
    state.direction = state.direction === "ASC" ? "DESC" : "ASC";
  } else {
    state.orderBy = column;
    state.direction = "ASC";
  }
};

// Handle pagination// Handle pagination
const goToPage = (page) => {
  if (page > 0 && page <= state.totalPages) {
    state.page = page;
  }
};
</script>

<template>
  <div class="container mx-auto py-6">
    <h1 class="text-2xl font-bold mb-4">Interaction History</h1>

    <!-- Filters -->
    <div class="bg-gray-100 p-4 rounded-lg mb-6">
      <h2 class="text-xl font-bold mb-2">Filters</h2>
      <form
        @submit.prevent="fetchInteractions"
        class="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div>
          <label for="campaign_name" class="block font-semibold"
            >Campaign Name:</label
          >
          <input
            type="text"
            id="campaign_name"
            v-model="state.filters.campaign_name"
            class="w-full border rounded px-2 py-1"
            placeholder="Enter campaign name"
          />
        </div>
        <div>
          <label for="account_name" class="block font-semibold"
            >Account Name:</label
          >
          <input
            type="text"
            id="account_name"
            v-model="state.filters.account_name"
            class="w-full border rounded px-2 py-1"
            placeholder="Enter account name"
          />
        </div>
        <div>
          <label for="contact_name" class="block font-semibold"
            >Contact Name:</label
          >
          <input
            type="text"
            id="contact_name"
            v-model="state.filters.contact_name"
            class="w-full border rounded px-2 py-1"
            placeholder="Enter contact name"
          />
        </div>
        <div>
          <label for="date_from" class="block font-semibold">Date From:</label>
          <input
            type="date"
            id="date_from"
            v-model="state.filters.date_from"
            class="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <label for="date_to" class="block font-semibold">Date To:</label>
          <input
            type="date"
            id="date_to"
            v-model="state.filters.date_to"
            class="w-full border rounded px-2 py-1"
          />
        </div>
        <div>
          <button
            type="submit"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Apply Filters
          </button>
        </div>
      </form>
    </div>

    <!-- Table -->
    <div v-if="state.isLoading" class="text-center py-4">Loading...</div>
    <div v-else-if="state.error" class="text-red-500 py-4">
      {{ state.error }}
    </div>
    <div v-else>
      <table class="table-auto w-full bg-white border rounded-lg shadow-md">
        <thead>
          <tr>
            <th
              @click="sortBy('user_name')"
              :class="{ 'bg-gray-200': state.orderBy === 'user_name' }"
              style="cursor: pointer"
              :aria-label="`Sort by ${
                state.orderBy === 'user_name' ? 'descending' : 'ascending'
              } order`"
            >
              User Name
            </th>
            <th
              @click="sortBy('campaign_name')"
              :class="{ 'bg-gray-200': state.orderBy === 'campaign_name' }"
              style="cursor: pointer"
              :aria-label="`Sort by ${
                state.orderBy === 'campaign_name' ? 'descending' : 'ascending'
              } order`"
            >
              Campaign Name
            </th>
            <th>Campaign Description</th>
            <th
              @click="sortBy('campaign_start_date')"
              :class="{
                'bg-gray-200': state.orderBy === 'campaign_start_date',
              }"
              style="cursor: pointer"
              :aria-label="`Sort by ${
                state.orderBy === 'campaign_start_date'
                  ? 'descending'
                  : 'ascending'
              } order`"
            >
              Campaign Start Date
            </th>
            <th
              @click="sortBy('campaign_end_date')"
              :class="{ 'bg-gray-200': state.orderBy === 'campaign_end_date' }"
              style="cursor: pointer"
              :aria-label="`Sort by ${
                state.orderBy === 'campaign_end_date'
                  ? 'descending'
                  : 'ascending'
              } order`"
            >
              Campaign End Date
            </th>
            <th
              @click="sortBy('campaign_status')"
              :class="{ 'bg-gray-200': state.orderBy === 'campaign_status' }"
              style="cursor: pointer"
              :aria-label="`Sort by ${
                state.orderBy === 'campaign_status' ? 'descending' : 'ascending'
              } order`"
            >
              Campaign Status
            </th>
            <th
              @click="sortBy('target_list_name')"
              :class="{ 'bg-gray-200': state.orderBy === 'target_list_name' }"
              style="cursor: pointer"
              :aria-label="`Sort by ${
                state.orderBy === 'target_list_name'
                  ? 'descending'
                  : 'ascending'
              } order`"
            >
              Target List Name
            </th>
            <th>Target List Description</th>
            <th
              @click="sortBy('account_name')"
              :class="{ 'bg-gray-200': state.orderBy === 'account_name' }"
              style="cursor: pointer"
              :aria-label="`Sort by ${
                state.orderBy === 'account_name' ? 'descending' : 'ascending'
              } order`"
            >
              Account Name
            </th>
            <th
              @click="sortBy('contact_name')"
              :class="{ 'bg-gray-200': state.orderBy === 'contact_name' }"
              style="cursor: pointer"
              :aria-label="`Sort by ${
                state.orderBy === 'contact_name' ? 'descending' : 'ascending'
              } order`"
            >
              Contact Name
            </th>
            <th
              @click="sortBy('contact_interaction_outcome')"
              :class="{
                'bg-gray-200': state.orderBy === 'contact_interaction_outcome',
              }"
              style="cursor: pointer"
              :aria-label="`Sort by ${
                state.orderBy === 'contact_interaction_outcome'
                  ? 'descending'
                  : 'ascending'
              } order`"
            >
              Contact Outcome
            </th>
            <th
              @click="sortBy('contact_phone')"
              :class="{ 'bg-gray-200': state.orderBy === 'contact_phone' }"
              style="cursor: pointer"
              :aria-label="`Sort by ${
                state.orderBy === 'contact_phone' ? 'descending' : 'ascending'
              } order`"
            >
              Contact Phone
            </th>
            <th>Contact Notes</th>
            <th
              @click="sortBy('contact_contacted_at')"
              :class="{
                'bg-gray-200': state.orderBy === 'contact_contacted_at',
              }"
              style="cursor: pointer"
              :aria-label="`Sort by ${
                state.orderBy === 'contact_contacted_at'
                  ? 'descending'
                  : 'ascending'
              } order`"
            >
              Contacted At
            </th>
            <th
              @click="sortBy('contact_next_contact_date')"
              :class="{
                'bg-gray-200': state.orderBy === 'contact_next_contact_date',
              }"
              style="cursor: pointer"
              :aria-label="`Sort by ${
                state.orderBy === 'contact_next_contact_date'
                  ? 'descending'
                  : 'ascending'
              } order`"
            >
              Next Contact Date
            </th>
            <th>Interaction Duration</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="interaction in state.interactions" :key="interaction.id">
            <td>{{ interaction.user_name }}</td>
            <td>{{ interaction.campaign_name }}</td>
            <td>{{ interaction.campaign_description }}</td>
            <td>{{ interaction.campaign_start_date }}</td>
            <td>{{ interaction.campaign_end_date }}</td>
            <td>{{ interaction.campaign_status }}</td>
            <td>{{ interaction.target_list_name }}</td>
            <td>{{ interaction.target_list_description }}</td>
            <td>{{ interaction.account_name }}</td>
            <td>{{ interaction.contact_name }}</td>
            <td>{{ interaction.contact_interaction_outcome }}</td>
            <td>{{ interaction.contact_phone }}</td>
            <td>{{ interaction.contact_notes }}</td>
            <td>{{ interaction.contact_contacted_at }}</td>
            <td>{{ interaction.contact_next_contact_date }}</td>
            <td>{{ interaction.contact_interaction_duration }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="flex justify-center mt-4">
        <button
          @click="goToPage(state.page - 1)"
          :disabled="state.page === 1"
          class="px-4 py-2 bg-gray-300 rounded-l"
        >
          Previous
        </button>
        <button
          @click="goToPage(page)"
          v-for="page in state.totalPages"
          :key="page"
          class="px-4 py-2"
          :class="{ 'bg-blue-500 text-white': page === state.page }"
        >
          {{ page }}
        </button>
        <button
          @click="goToPage(state.page + 1)"
          :disabled="state.page === state.totalPages"
          class="px-4 py-2 bg-gray-300 rounded-r"
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>
