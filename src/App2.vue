<script>
export default {
  data() {
    return {
      name: "history",
      status: "active",
      tasks: ["Task 1", "Task 2", "Task 3"],
      link: "https://google.com",
    };
  },
  methods: {
    toggleStatus() {
      if (this.status === "active") {
        this.status = "pending";
      } else if (this.status === "pending") {
        this.status = "inactive";
      } else {
        this.status = "active";
      }
    },
  },
};
</script>

<template>
  <h2>filter</h2>
  <h2>{{ name }}</h2>
  <p v-if="status === 'active'">Activated</p>
  <p v-else-if="status === 'pending'">Pending</p>
  <p v-else>Inactive</p>

  <h3>Tasks</h3>

  <ul>
    <li v-for="task in tasks" :key="task">
      {{ task }}
    </li>
  </ul>

  <!-- Nedan båda e samma sak, kolon i den korta 'r att linken ska vara dynamisk' -->

  <!-- <button v-on:click="toggleStatus">Change Status</button> -->
  <button @click="toggleStatus">Change Status</button>

  <br />
  <!-- <a v-bind:href="link">Google</a> -->
  <a :href="link">Google</a>
</template>

<style></style>
