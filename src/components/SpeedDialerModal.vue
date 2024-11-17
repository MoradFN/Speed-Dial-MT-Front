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

// Close the modal and reset the index
const closeModal = () => {
  emits("close");
  state.currentAccountIndex = 0;
};
</script>

<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
  >
    <div class="bg-white p-6 rounded-lg shadow-lg w-1/3">
      <div class="text-center">
        <h3 class="text-xl font-bold">{{ currentAccount.account_name }}</h3>
        <p>Account ID: {{ currentAccount.account_id }}</p>
      </div>
      <div class="mt-6 flex justify-between">
        <button
          @click="closeModal"
          class="bg-gray-500 text-white px-4 py-2 rounded"
        >
          Close
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
</template>
