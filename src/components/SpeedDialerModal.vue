<script setup>
import { reactive, computed, defineProps, defineEmits } from "vue";
import axios from "axios";

const props = defineProps({
  accounts: {
    type: Array,
    required: true,
  },
  isVisible: {
    type: Boolean,
    required: true,
  },
  targetListId: {
    type: [Number, String],
    required: true,
  },
});

const emits = defineEmits(["close"]);

const state = reactive({
  currentAccountIndex: 0, // Tracks the current account being displayed
});

// Compute the current account based on the index
const currentAccount = computed(() => {
  return props.accounts[state.currentAccountIndex] || {};
});

// Move to the next account
const nextAccount = () => {
  state.currentAccountIndex =
    (state.currentAccountIndex + 1) % props.accounts.length;
};

const previousAccount = () => {
  state.currentAccountIndex =
    (state.currentAccountIndex - 1 + props.accounts.length) %
    props.accounts.length;
};

// Log interaction
const logInteraction = async (contact) => {
  try {
    // Validate required fields
    if (!contact.callOutcome) {
      alert("Please select a call outcome.");
      return;
    }

    // Prepare the payload
    const payload = {
      contact_id: contact.contact_id,
      user_id: 1, // Replace with the actual user ID if available
      target_list_id: props.targetListId, // Use the dynamically passed target list ID // e detta slug?
      next_contact_date: contact.nextContactDate,
      notes: contact.notesInput,
      outcome: contact.callOutcome,
      contact_method: "call", // Adjust as needed
    };

    // Make the API call
    const response = await axios.post(
      "/api/index.php?route=log-contact-interaction",
      payload
    );

    // Handle success response
    console.log("Interaction logged successfully:", response.data);
    alert("Interaction logged successfully!");

    // Reset input fields
    contact.callOutcome = "";
    contact.notesInput = "";
    contact.nextContactDate = null;
  } catch (error) {
    // Handle errors and display feedback
    console.error(
      "Failed to log interaction:",
      error.response?.data || error.message
    );
    alert(
      "Failed to log interaction: " +
        (error.response?.data?.message || error.message)
    );
  }
};

// Close the modal and reset the index
const closeModal = () => {
  emits("close");
  // state.currentAccountIndex = 0; // För att resetta index vid close
};
</script>

<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-8 modal"
    @click.self="closeModal"
  >
    <!-- Modal Size -->
    <!-- Put max height and scrolling. -->
    <div
      class="bg-white p-8 rounded-lg shadow-lg w-3/4 max-w-6xl min-h-[600px] max-h-[90vh] modal-content overflow-y-auto flex flex-col"
    >
      <!-- Account Details -->
      <div class="flex-1">
        <div class="text-center">
          <!-- Account Name and ID -->
          <h3 class="text-3xl font-bold text-green-700">
            {{ currentAccount.account_name }}
          </h3>
          <p class="text-sm text-gray-500">
            Account ID: {{ currentAccount.account_id }}
          </p>
          <p v-if="currentAccount.industry" class="text-sm text-gray-500">
            <span class="text-gray-700">Industry:</span>
            {{ currentAccount.industry }}
          </p>
        </div>

        <!-- Email and Phone -->
        <div class="flex justify-between items-center mt-6">
          <p v-if="currentAccount.account_email" class="flex-1">
            <span class="font-semibold text-gray-700">Email:</span>
            <a
              :href="`mailto:${currentAccount.account_email}`"
              class="text-blue-600 underline"
            >
              {{ currentAccount.account_email }}
            </a>
          </p>
          <p v-if="currentAccount.account_phone" class="flex-1 text-right">
            <span class="font-semibold text-gray-700">Phone:</span>
            <a
              :href="`tel:${currentAccount.account_phone}`"
              class="text-blue-600 underline"
            >
              {{ currentAccount.account_phone }}
            </a>
          </p>
        </div>

        <!-- Address and Webpage -->
        <div class="flex justify-between items-center mt-4">
          <p v-if="currentAccount.address" class="flex-1">
            <span class="font-semibold text-gray-700">Address:</span>
            {{ currentAccount.city ? `${currentAccount.city},` : "" }}
            {{ currentAccount.state ? `${currentAccount.state}` : "" }}
          </p>
          <p v-if="currentAccount.website" class="flex-1 text-right">
            <span class="font-semibold text-gray-700">Webpage:</span>
            <a
              :href="
                currentAccount.website.startsWith('http')
                  ? currentAccount.website
                  : `http://${currentAccount.website}`
              "
              target="_blank"
              class="text-blue-600 underline"
            >
              {{ currentAccount.website }}
            </a>
          </p>
        </div>
      </div>
      <!-- Contacts List -->
      <div class="flex-1 overflow-y-auto">
        <h4 class="text-xl font-bold mb-4">Contacts</h4>
        <div v-if="currentAccount.contacts && currentAccount.contacts.length">
          <ul>
            <li
              v-for="contact in currentAccount.contacts"
              :key="contact.contact_id"
              @click="contact.showDetails = !contact.showDetails"
              class="mb-4 p-4 border rounded-md shadow-sm bg-blue-50 cursor-pointer hover:bg-blue-100 transition"
            >
              <div class="flex justify-between items-center">
                <!-- Contact Name and Status -->
                <div>
                  <p class="text-lg font-semibold text-blue-700">
                    {{ contact.first_name }} {{ contact.last_name }} -
                    {{ contact.job_title || "N/A" }}
                    <span class="text-gray-500 text-sm">
                      (ID: {{ contact.contact_id }}) ({{
                        contact.contact_status || "Unknown"
                      }})
                    </span>
                  </p>
                </div>
                <!-- Contact Details -->
                <div class="text-right">
                  <p>
                    <span class="font-semibold">Email:</span>
                    <a
                      :href="`mailto:${contact.contact_email}`"
                      class="text-blue-600 underline"
                      @click.stop
                    >
                      {{ contact.contact_email || "N/A" }}
                    </a>
                    |
                    <span class="font-semibold">Phone:</span>
                    <a
                      :href="`tel:${contact.contact_phone}`"
                      class="text-blue-600 underline"
                      @click.stop
                    >
                      {{ contact.contact_phone || "N/A" }}
                    </a>
                    |
                    <span class="font-semibold">Mobile:</span>
                    <a
                      :href="`tel:${contact.mobile_phone}`"
                      class="text-blue-600 underline"
                      @click.stop
                    >
                      {{ contact.mobile_phone || "N/A" }}
                    </a>
                  </p>
                </div>
              </div>
              <!-- Expanded Notes and Log Call Outcome Section -->
              <div v-if="contact.showDetails" class="mt-3">
                <!-- Notes -->
                <p>
                  <span class="font-semibold">Notes:</span>
                  {{ contact.notes || "No notes available." }}
                </p>
                <!-- Log Call Outcome Button -->
                <p
                  @click.stop="contact.showForm = !contact.showForm"
                  class="mt-3 text-blue-600 cursor-pointer hover:underline text-center font-semibold"
                >
                  {{
                    contact.showForm
                      ? "Hide Call Outcome Form"
                      : "Log Call Outcome"
                  }}
                </p>

                <!-- Log Call Outcome Form -->
                <div v-if="contact.showForm" class="mt-4 border-t pt-4">
                  <form @click.stop @submit.prevent="logInteraction(contact)">
                    <!-- Call Outcome -->
                    <div class="mb-4">
                      <label for="outcome" class="block font-semibold"
                        >Call Outcome:</label
                      >
                      <select
                        id="outcome"
                        v-model="contact.callOutcome"
                        class="w-full border rounded px-4 py-2"
                        required
                      >
                        <option value="" disabled>Select an outcome</option>
                        <option>Interested</option>
                        <option>Busy</option>
                        <option>Not Interested</option>
                        <option>No Answer</option>
                        <option>Other - Check Notes</option>
                      </select>
                    </div>

                    <!-- Notes -->
                    <div class="mb-4">
                      <label for="notes" class="block font-semibold"
                        >Notes:</label
                      >
                      <textarea
                        id="notes"
                        v-model="contact.notesInput"
                        rows="3"
                        class="w-full border rounded px-4 py-2"
                        placeholder="Add any notes here..."
                      ></textarea>
                    </div>

                    <!-- Next Contact Date -->
                    <div class="mb-4">
                      <label for="next-contact" class="block font-semibold"
                        >Next Contact Date:</label
                      >
                      <input
                        id="next-contact"
                        type="date"
                        v-model="contact.nextContactDate"
                        class="w-full border rounded px-4 py-2"
                      />
                    </div>

                    <!-- Submit Button -->
                    <button
                      type="submit"
                      class="mt-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded shadow-sm"
                    >
                      Log Interaction
                    </button>
                  </form>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <p v-else>No contacts available for this account.</p>
      </div>

      <!-- Navigation Buttons -->
      <div class="mt-6 flex justify-between items-center border-t pt-4">
        <button
          @click="closeModal"
          class="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
        >
          Close
        </button>
        <div>
          <button
            @click="previousAccount"
            class="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 mr-2"
          >
            Previous
          </button>
          <button
            @click="nextAccount"
            class="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal {
  animation: fadeIn 0.3s ease-in-out;
}
/* .modal-content {
  max-height: 90vh;
  overflow-y: auto;
} */

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
