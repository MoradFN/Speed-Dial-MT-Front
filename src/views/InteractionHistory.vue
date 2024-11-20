<script setup>
import { reactive, computed, onMounted } from "vue";
import axios from "axios";
import { fetchInteractionsAPI } from "@/services/api";

/////MTTODO FIXA SÅ ATT NÄR DU ÄR PÅ SISTA PAGEN OCH FILTRERAR BORT ALA ITEMS FÖRUTOM EN
////// OPEN AND CLOSE FILTER SEARCH
///// ADD COMUMNS OPEN AND CLOSE?
/// STYTLING SIST

// Reactive state
const state = reactive({
  interactions: [],
  isLoading: true,
  error: null,
  extraColumnVisibility: {
    showCampaignStartDate: false,
    showCampaignEndDate: false,
    showCampaignStatus: false,
    // showContactPhone: false,
    // showContactInteractionDuration: false,
  },
  expandedRows: new Set(),
  filters: {
    campaign_name: "",
    campaign_status: "",
    target_list_name: "",
    account_name: "",
    contact_name: "",
    contact_phone: "",
    contact_interaction_outcome: "",
    date_field: "contact_contacted_at",
    date_from: null,
    date_to: null,
  },
  orderBy: "contact_contacted_at",
  direction: "DESC",
  pagination: {
    page: 1,
    limit: 10,
  },
});

////////////////////////// SORTING AND FILTERING
const buildQueryParams = () => {
  return {
    ...state.filters,
    page: state.pagination.page,
    limit: state.pagination.limit,
    orderBy: state.orderBy,
    direction: state.direction,
  };
};

const sortBy = (column) => {
  if (state.orderBy === column) {
    state.direction = state.direction === "ASC" ? "DESC" : "ASC";
  } else {
    state.orderBy = column;
    state.direction = "ASC";
  }
  fetchInteractions(); // Fetch updated data
};

const clearFilters = () => {
  state.filters = {
    campaign_name: "",
    campaign_status: "",
    target_list_name: "",
    account_name: "",
    contact_name: "",
    contact_phone: "",
    contact_interaction_outcome: "",
    date_field: "contact_contacted_at",
    date_from: null,
    date_to: null,
  };
  // state.pagination.page = 1; // Reset to the first page
  fetchInteractions(); // Fetch updated results
};

const goToPage = (page) => {
  if (page > 0 && page <= state.pagination.totalPages) {
    state.pagination.page = page;
    fetchInteractions();
  }
};

////////////////////////////////////////////////

// Fetch interaction history
const fetchInteractions = async () => {
  state.isLoading = true;
  state.error = null;

  try {
    const response = await fetchInteractionsAPI(buildQueryParams());
    const data = response.data;
    state.interactions = data.interactionHistory || [];
    state.pagination.page = data.page || 1;
    state.pagination.limit = data.limit || 10;
    state.pagination.totalPages = data.totalPages || 1;
    state.pagination.totalRecords = data.totalRecords || 0;

    console.log("Fetched interactions:", state.interactions);
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
  { key: "contact_interaction_outcome", label: "Outcome" },
  { key: "contact_contacted_at", label: "Contacted At" },
  { key: "contact_next_contact_date", label: "Next Contact Date" },
  // {
  //   key: "contact_phone",
  //   label: "Contact Phone",
  //   visibility: () => state.extraColumnVisibility.showContactPhone,
  // },
  // {
  //   key: "contact_interaction_duration",
  //   label: "Contact Interaction Duration",
  //   visibility: () =>
  //     state.extraColumnVisibility.showContactInteractionDuration,
  // },
];

// Computed property for visible columns
const visibleColumns = computed(() =>
  columns.filter((column) => !column.visibility || column.visibility())
);

const toggleRow = (id) => {
  if (state.expandedRows.has(id)) {
    state.expandedRows.delete(id); // Remove the ID if it exists
  } else {
    state.expandedRows.add(id); // Add the ID if it doesn't exist
  }
};

// Fetch data on mount
onMounted(async () => {
  await fetchInteractions();
});
</script>

<template>
  <div class="w-[90vw] mx-auto py-6">
    <h1 class="text-2xl font-bold mb-4">Interaction History</h1>

    <!-- Filters Section n buttons -->
    <div class="p-4 bg-white shadow-md rounded-lg mb-4">
      <h2 class="text-lg font-semibold mb-4">Filters</h2>
      <!-- Filter Content -->

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <!-- Campaign Name -->
        <div>
          <label class="block font-semibold">Campaign Name</label>
          <input
            v-model="state.filters.campaign_name"
            class="w-full border rounded px-2 py-1"
            placeholder="Enter campaign name"
          />
        </div>

        <!-- Campaign Status -->
        <div>
          <label class="block font-semibold">Campaign Status</label>
          <select
            v-model="state.filters.campaign_status"
            class="w-full border rounded px-2 py-1"
          >
            <option value="">All</option>
            <option value="completed">Completed</option>
            <option value="active">Active</option>
            <option value="planned">Planned</option>
          </select>
        </div>

        <!-- Target List Name -->
        <div>
          <label class="block font-semibold">Target List Name</label>
          <input
            v-model="state.filters.target_list_name"
            class="w-full border rounded px-2 py-1"
            placeholder="Enter target list name"
          />
        </div>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <!-- Account Name -->
        <div>
          <label class="block font-semibold">Account Name</label>
          <input
            v-model="state.filters.account_name"
            class="w-full border rounded px-2 py-1"
            placeholder="Enter account name"
          />
        </div>

        <!-- Contact Name -->
        <div>
          <label class="block font-semibold">Contact Name</label>
          <input
            v-model="state.filters.contact_name"
            class="w-full border rounded px-2 py-1"
            placeholder="Enter contact name"
          />
        </div>

        <!-- Contact Phone -->
        <div>
          <label class="block font-semibold">Contact Phone</label>
          <input
            v-model="state.filters.contact_phone"
            class="w-full border rounded px-2 py-1"
            placeholder="Enter contact phone"
          />
        </div>
        <div>
          <label class="block font-semibold">Contact Outcome</label>
          <select
            v-model="state.filters.contact_interaction_outcome"
            class="w-full border rounded px-2 py-1"
          >
            <option value="">All</option>
            <option value="interested">Interested</option>
            <option value="not_interested">Not Interested</option>
            <option value="busy">Busy</option>
            <option value="not_reachable">No Answer</option>
            <option value="unreachable">Unreachable</option>
            <option value="other - check notes">Other</option>
          </select>
        </div>
      </div>
      <!-- Contact Outcome -->

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <!-- Date Field Selection -->
        <div>
          <label class="block font-semibold">Date Field</label>
          <select
            v-model="state.filters.date_field"
            class="w-full border rounded px-2 py-1"
          >
            <option value="contact_contacted_at">Contacted At</option>
            <option value="contact_next_contact_date">Next Contact Date</option>
          </select>
        </div>

        <!-- Date From -->
        <div>
          <label class="block font-semibold">Date From</label>
          <input
            type="date"
            v-model="state.filters.date_from"
            class="w-full border rounded px-2 py-1"
          />
        </div>

        <!-- Date To -->
        <div>
          <label class="block font-semibold">Date To</label>
          <input
            type="date"
            v-model="state.filters.date_to"
            class="w-full border rounded px-2 py-1"
          />
        </div>
      </div>

      <!-- Filter and Clear Buttons -->
      <div class="flex justify-start gap-4">
        <button
          @click="fetchInteractions"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Apply Filters
        </button>
        <button
          @click="clearFilters"
          class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Clear Filters
        </button>
      </div>
    </div>

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
            class="header-cell text-sm cursor-pointer"
            @click="sortBy(column.key)"
          >
            {{ column.label }}
            <i
              v-if="state.orderBy === column.key"
              class="pi"
              :class="{
                'pi-angle-down': state.direction === 'ASC',
                'pi-angle-up': state.direction === 'DESC',
              }"
            ></i>
          </div>
        </div>

        <!-- Data rows -->
        <div v-for="interaction in state.interactions" :key="interaction.id">
          <!-- Main Row -->
          <div
            class="grid p-4 border-b cursor-pointer hover:bg-gray-200"
            :style="{
              gridTemplateColumns: `repeat(${visibleColumns.length}, minmax(auto, 1fr))`,
            }"
            @click="toggleRow(interaction.id)"
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
            v-if="state.expandedRows.has(interaction.id)"
            class="bg-gray-100 p-4 border-b"
            :style="{
              gridColumn: `span ${visibleColumns.length}`,
            }"
          >
            <p>
              <strong>Contact Phone:</strong>
              {{ interaction.contact_phone || "N/A" }}
            </p>
            <p>
              <strong>Interaction Duration:</strong>
              {{ interaction.contact_interaction_duration || "N/A" }}
            </p>
            <p>
              <strong>Interaction Notes:</strong>
              {{ interaction.contact_notes || "N/A" }}
            </p>
            <p>
              <strong>Campaign Description:</strong>
              {{ interaction.campaign_description || "N/A" }}
            </p>
            <p>
              <strong>Target List Description:</strong>
              {{ interaction.target_list_description || "N/A" }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="flex justify-center items-center mt-4 space-x-2">
    <button
      @click="goToPage(state.pagination.page - 1)"
      :disabled="state.pagination.page === 1"
      class="px-4 py-2 bg-gray-300 rounded-l disabled:opacity-50"
    >
      Previous
    </button>
    <button
      v-for="page in state.pagination.totalPages"
      :key="page"
      @click="goToPage(page)"
      class="px-4 py-2 border rounded"
      :class="{ 'bg-blue-500 text-white': state.pagination.page === page }"
    >
      {{ page }}
    </button>
    <button
      @click="goToPage(state.pagination.page + 1)"
      :disabled="state.pagination.page === state.pagination.totalPages"
      class="px-4 py-2 bg-gray-300 rounded-r disabled:opacity-50"
    >
      Next
    </button>
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
.grid {
  transition: background-color 0.2s ease;
}

.grid:hover {
  background-color: #f3f4f6;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
