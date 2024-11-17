<template>
  <div v-if="isVisible" class="modal-overlay">
    <div class="modal-content">
      <button @click="closeModal" class="close-btn">✕</button>

      <div v-if="contact">
        <h2 class="text-2xl font-bold">
          {{ contact.first_name }} {{ contact.last_name }}
        </h2>
        <p><strong>Phone:</strong> {{ contact.contact_phone }}</p>
        <p><strong>Email:</strong> {{ contact.contact_email }}</p>
        <p><strong>Notes:</strong> {{ contact.notes }}</p>

        <!-- Outcome Logging Form -->
        <div class="mt-4">
          <label for="outcome">Outcome:</label>
          <select v-model="outcome" id="outcome" class="input">
            <option value="connected">Connected</option>
            <option value="not_interested">Not Interested</option>
            <option value="left_voicemail">Left Voicemail</option>
          </select>

          <label for="notes" class="mt-2">Notes:</label>
          <textarea v-model="notes" id="notes" class="input"></textarea>

          <button @click="logInteraction" class="primary-btn mt-4">
            Log Outcome
          </button>
        </div>

        <!-- Navigation Controls -->
        <div class="mt-6 flex justify-between">
          <button
            @click="previousContact"
            :disabled="!hasPrevious"
            class="secondary-btn"
          >
            Previous
          </button>
          <button
            @click="nextContact"
            :disabled="!hasNext"
            class="secondary-btn"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";

const props = defineProps({
  contacts: Array,
  isVisible: Boolean,
  onClose: Function,
});

const router = useRouter();
const toast = useToast();

const contactIndex = ref(0);
const outcome = ref("");
const notes = ref("");

const contact = computed(() => props.contacts[contactIndex.value]);

const hasPrevious = computed(() => contactIndex.value > 0);
const hasNext = computed(() => contactIndex.value < props.contacts.length - 1);

const closeModal = () => {
  props.onClose();
};

const previousContact = () => {
  if (hasPrevious.value) contactIndex.value--;
};

const nextContact = () => {
  if (hasNext.value) contactIndex.value++;
};

const logInteraction = () => {
  if (!outcome.value) {
    toast.error("Please select an outcome.");
    return;
  }
  // Here you would send the interaction data to the backend
  console.log(`Logged outcome: ${outcome.value}, notes: ${notes.value}`);
  toast.success("Interaction logged successfully!");
  outcome.value = "";
  notes.value = "";
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
}
.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 1.5rem;
}
.input {
  width: 100%;
  padding: 8px;
  margin-top: 8px;
}
.primary-btn {
  background-color: #38a169;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
}
.secondary-btn {
  background-color: #4299e1;
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
}
</style>
