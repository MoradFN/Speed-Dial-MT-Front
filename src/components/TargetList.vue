<script setup>
import { RouterLink } from "vue-router";
import { defineProps, ref, computed } from "vue";
/// ENSKILT KORT FÖR VARJE TARGET LIST
// MTTODO BYT TILL ATT VISA SPECIFIC TARGET LIST MED INNEHÅLLET AV ACCOUNTS OCH KONTAKTER använd JObListings(plural) COMPONENT SOM MALL?.
//SPEED DIALER START BUTTUN HÄR?
const props = defineProps({
  targetList: {
    type: Object,
    // required: true,
  },
});

const showFullDescription = ref(false);

const toggleFullDescription = () => {
  showFullDescription.value = !showFullDescription.value;
};

const truncatedDescription = computed(() => {
  let description = props.targetList.description;
  if (!showFullDescription.value) {
    description = description.substring(0, 90) + "...";
  }
  return description;
});
</script>
<template>
  <div class="bg-white rounded-xl shadow-md relative">
    <div class="p-4">
      <div class="mb-6">
        <div class="text-gray-600 my-2">
          Campaign: {{ targetList.campaign_name }}
        </div>
        <h3 class="text-xl font-bold">{{ targetList.name }}</h3>
      </div>

      <div class="mb-5">
        <div>{{ truncatedDescription }}</div>
        <button
          @click="toggleFullDescription"
          class="text-green-500 hover:text-green-600 mb-5"
        >
          {{ showFullDescription ? "Less" : "More" }}
        </button>
      </div>

      <h3 class="text-green-500 mb-2">{{ targetList.created_at }}</h3>

      <div class="border border-gray-100 mb-5"></div>

      <div class="flex flex-col lg:flex-row justify-between mb-4">
        <div class="text-orange-700 mb-3">
          <i class="pi pi-map-marker text-orange-700"></i>
          Status: {{ targetList.status }}
        </div>
        <!-- MTTODO ändra /job? -->
        <!-- länk concat -->
        <RouterLink
          :to="'/jobs/' + targetList.id"
          class="h-[36px] bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-center text-sm"
        >
          Read More
        </RouterLink>
      </div>
    </div>
  </div>
</template>
