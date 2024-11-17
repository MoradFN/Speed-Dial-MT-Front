<script setup>
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import SpeedDialerModal from "@/components/SpeedDialerModal.vue";
import BackButton from "@/components/BackButton.vue";
import { reactive, onMounted } from "vue";
import { useRoute, RouterLink, useRouter } from "vue-router";
import { useToast } from "vue-toastification";

import axios from "axios";

const route = useRoute();
const router = useRouter();
const toast = useToast();

const targetListId = route.params.id; // om jag ska använda id = params.id, om jag använder slug = params.slug.

const state = reactive({
  targetList: {},
  isLoading: true,
  openContacts: {}, // Track open/close state for each account’s contacts
  isModalVisible: false,
  accounts: [
    { account_id: 1, account_name: "Acme Corporation" },
    { account_id: 2, account_name: "Globex Corporation" },
    { account_id: 3, account_name: "Initech" },
  ],
});

// const toggleModal = () => {
//   state.isModalVisible = !state.isModalVisible;
// };

const openModal = () => {
  state.isModalVisible = true;
};

const closeModal = () => {
  state.isModalVisible = false;
};

const deleteTargetList = async () => {
  try {
    const confirm = window.confirm(
      "Are you sure you want to delete this target list?"
    );
    if (confirm) {
      await axios.delete(
        `/api/index.php?route=delete-target-list&id=${targetListId}`
      );
      toast.success("Target List Deleted Successfully");
      router.push("/target-lists");
    }
  } catch (error) {
    console.error("Error deleting target list", error);
    toast.error("Target List Was Not Deleted");
  }
};

// Toggle contacts visibility for a specific account
const toggleContacts = (accountId) => {
  state.openContacts[accountId] = !state.openContacts[accountId];
};

// Fetch specific target list details on mount
onMounted(async () => {
  try {
    const response = await axios.get(
      `/api/index.php?route=target-list-detail&id=${targetListId}`
    );
    console.log(response.data); // Debugging to check the response structure
    state.targetList = response.data.targetList;
  } catch (error) {
    console.error("Error fetching target list", error);
  } finally {
    state.isLoading = false;
  }
});
</script>

<template>
  <BackButton />
  <section v-if="!state.isLoading" class="bg-green-50">
    <div class="container m-auto py-10 px-6">
      <div class="grid grid-cols-1 md:grid-cols-70/30 w-full gap-6">
        <main>
          <div
            class="bg-white p-6 rounded-lg shadow-md text-center md:text-left"
          >
            <!-- mttodo -->
            <div class="text-gray-500 mb-4">
              {{ state.targetList.campaign_name }}
            </div>

            <h1 class="text-3xl font-bold mb-4">
              {{ state.targetList.name }}
            </h1>

            <p class="mb-4">
              {{ state.targetList.description }}
            </p>
            <h3
              v-if="state.targetList.end_date"
              class="text-green-800 text-lg font-bold mb-2"
            >
              slut datum
            </h3>

            <p class="mb-4">{{ state.targetList.end_date }}</p>
            <div
              class="text-gray-500 mb-4 flex align-middle justify-center md:justify-start"
            >
              <i class="pi pi-bolt text-xl text-orange-700 mr-2"></i>
              <p class="text-orange-700">{{ state.targetList.status }}</p>
            </div>
          </div>
          <div
            v-for="account in state.targetList.accounts"
            :key="account.account_id"
            class="bg-white p-6 rounded-lg shadow-md mt-6"
          >
            <h4 class="text-xl font-bold">{{ account.account_name }}</h4>
            <hr class="my-2" />
            <p v-if="account.industry">
              <strong>Industry:</strong> {{ account.industry }}
            </p>

            <p><strong>Företags Email:</strong> {{ account.account_email }}</p>
            <p>
              <strong>Företags Telefon:</strong> {{ account.account_phone }}
            </p>

            <div
              class="text-gray-500 mb-4 flex align-middle justify-center md:justify-start"
            >
              <i class="pi pi-map-marker text-xl text-orange-700 mr-2"></i>
              <p>
                {{ account.address }}, {{ account.city }},
                {{ account.country }}
              </p>
            </div>
            <hr class="my-2" />

            <div class="flex items-center justify-center md:justify-start">
              <i class="pi pi-users text-xl text-blue-700 mr-2"></i>
              <h5
                class="text-lg font-bold mt-4 cursor-pointer flex items-center"
                @click="toggleContacts(account.account_id)"
              >
                Contacts
                <i
                  :class="{
                    'pi-angle-double-down':
                      state.openContacts[account.account_id],
                    'pi-angle-double-up':
                      !state.openContacts[account.account_id],
                  }"
                  class="pi text-xl ml-2"
                ></i>
              </h5>
            </div>

            <!-- Contacts List (conditionally rendered) -->
            <ul v-if="state.openContacts[account.account_id]">
              <li
                v-for="contact in account.contacts"
                :key="contact.contact_id"
                class="mb-4"
              >
                <p>
                  <strong
                    >{{ contact.first_name }} {{ contact.last_name }}</strong
                  >
                  - {{ contact.job_title }}
                </p>
                <p><strong>Email:</strong> {{ contact.contact_email }}</p>
                <p><strong>Phone:</strong> {{ contact.contact_phone }}</p>
                <p><strong>Status:</strong> {{ contact.contact_status }}</p>
                <p><strong>Notes:</strong> {{ contact.notes }}</p>
                <hr />
              </li>
            </ul>
          </div>
        </main>

        <!-- Sidebar -->
        <aside>
          <!-- Manage Target List -->
          <!-- OBS ÄNDRAD TEXT, EDIT SKA ÄNDRAS TILL STARTA SPEED DIALER OCH CHECK RECENT LOGS! -->
          <div class="bg-white p-6 rounded-lg shadow-md mt-6">
            <h3 class="text-xl font-bold mb-6">Speed Dialer</h3>
            <button
              @click="openModal"
              class="bg-green-500 text-white px-4 py-2 rounded"
            >
              Open Modal
            </button>

            <button
              @click="deleteTargetList"
              class="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block"
            >
              Check Recent Logs
            </button>
          </div>
        </aside>
      </div>
    </div>
  </section>
  <!-- Show loading spinner while loading is true -->
  <div v-else class="text-center text-gray-500 py-6">
    <PulseLoader />
  </div>

  <SpeedDialerModal
    :accounts="state.accounts"
    :isVisible="state.isModalVisible"
    @close="closeModal"
  />
</template>
