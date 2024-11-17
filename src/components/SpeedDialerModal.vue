<script setup>
import { reactive, computed, defineProps, defineEmits } from "vue";

const props = defineProps({
  accounts: {
    type: Array,
    required: true,
  },
  isVisible: {
    type: Boolean,
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

// Close the modal and reset the index
const closeModal = () => {
  emits("close");
  // state.currentAccountIndex = 0; // För att resetta index vid close
};
</script>

<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center modal"
    @click.self="closeModal"
  >
    <div class="bg-white p-6 rounded-lg shadow-lg w-1/3 modal-content">
      <!-- Account Details -->
      <div class="text-center">
        <h3 class="text-xl font-bold">{{ currentAccount.account_name }}</h3>
        <p>Account ID: {{ currentAccount.account_id }}</p>
        <p v-if="currentAccount.industry">
          <strong>Industry:</strong> {{ currentAccount.industry }}
        </p>
        <p v-if="currentAccount.account_email">
          <strong>Email:</strong> {{ currentAccount.account_email }}
        </p>
        <p v-if="currentAccount.account_phone">
          <strong>Phone:</strong> {{ currentAccount.account_phone }}
        </p>
        <p v-if="currentAccount.address">
          <strong>Address:</strong>
          {{ currentAccount.address }}, {{ currentAccount.city }},
          {{ currentAccount.state }} {{ currentAccount.postal_code }},
          {{ currentAccount.country }}
        </p>
      </div>
      <!-- // Account Details -->
      <!-- Contacts List -->
      <div class="mt-6">
        <h4 class="text-lg font-bold mb-3">Contacts</h4>
        <div v-if="currentAccount.contacts && currentAccount.contacts.length">
          <ul>
            <li
              v-for="contact in currentAccount.contacts"
              :key="contact.contact_id"
              class="mb-4 border-b pb-2"
            >
              <p>
                <strong
                  >{{ contact.first_name }} {{ contact.last_name }}</strong
                >
                - {{ contact.job_title || "N/A" }}
              </p>
              <p v-if="contact.contact_email">
                <strong>Email:</strong> {{ contact.contact_email }}
              </p>
              <p v-if="contact.contact_phone">
                <strong>Phone:</strong> {{ contact.contact_phone }}
              </p>
              <p v-if="contact.mobile_phone">
                <strong>Mobile:</strong> {{ contact.mobile_phone }}
              </p>
              <p v-if="contact.notes">
                <strong>Notes:</strong> {{ contact.notes }}
              </p>
            </li>
          </ul>
        </div>
        <p v-else>No contacts available for this account.</p>
      </div>
      <!-- // Contacts List -->

      <div class="mt-6 flex justify-between">
        <button
          @click="closeModal"
          class="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Close
        </button>
        <div>
          <button
            @click="previousAccount"
            class="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          >
            Previous
          </button>
          <button
            @click="nextAccount"
            class="bg-blue-500 text-white px-4 py-2 rounded"
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

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* .modal-content {
  max-height: 80vh;
  overflow-y: auto;
} */
</style>
