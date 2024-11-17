<script setup>
import { reactive, watch } from "vue";

const props = defineProps({
  contacts: Array,
  isVisible: Boolean,
});

const emit = defineEmits(["onClose"]);

const state = reactive({
  currentContactIndex: 0,
});

// Move to the next contact
const nextContact = () => {
  if (state.currentContactIndex < props.contacts.length - 1) {
    state.currentContactIndex++;
  } else {
    state.currentContactIndex = 0; // Loop back to the first contact
  }
};

// Move to the previous contact
const previousContact = () => {
  if (state.currentContactIndex > 0) {
    state.currentContactIndex--;
  } else {
    state.currentContactIndex = props.contacts.length - 1; // Loop back to the last contact
  }
};

// Close the modal
const closeModal = () => {
  emit("onClose");
};
</script>

<template>
  <div v-if="isVisible" class="modal">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h5 class="modal-title">
            {{ props.contacts[state.currentContactIndex]?.first_name }}
            {{ props.contacts[state.currentContactIndex]?.last_name }}
          </h5>
          <button type="button" class="close" @click="closeModal">
            &times;
          </button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body">
          <p>
            <strong>Email:</strong>
            {{ props.contacts[state.currentContactIndex]?.contact_email }}
          </p>
          <p>
            <strong>Phone:</strong>
            {{ props.contacts[state.currentContactIndex]?.contact_phone }}
          </p>
          <p>
            <strong>Status:</strong>
            {{ props.contacts[state.currentContactIndex]?.contact_status }}
          </p>
          <p>
            <strong>Notes:</strong>
            {{ props.contacts[state.currentContactIndex]?.notes }}
          </p>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeModal">Close</button>
          <button class="btn btn-primary" @click="previousContact">
            Previous
          </button>
          <button class="btn btn-primary" @click="nextContact">Next</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
