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
    <div
      class="bg-white p-8 rounded-lg shadow-lg w-2/3 max-w-4xl modal-content"
    >
      <!-- Account Details -->
      <div class="p-6 border-b border-gray-200 mb-6">
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
      <div class="p-6 border-b border-gray-200">
        <h4 class="text-xl font-bold mb-4">Contacts</h4>
        <div v-if="currentAccount.contacts && currentAccount.contacts.length">
          <ul>
            <li
              v-for="contact in currentAccount.contacts"
              :key="contact.contact_id"
              class="mb-4 pb-2 border-b"
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

      <!-- Navigation Buttons -->
      <div class="mt-6 flex justify-between">
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
