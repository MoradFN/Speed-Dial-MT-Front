<script setup>
import { ref, onMounted } from "vue";

const name = ref("John Doe");
const status = ref("active");
const tasks = ref(["Task1", "Task2", "Task3"]);
const link = ref("https://google.com");
const newTask = ref("");

const toggleStatus = () => {
  if (status.value === "active") {
    status.value = "pending";
  } else if (status.value === "pending") {
    status.value = "inactive";
  } else {
    status.value = "active";
  }
};

const addTask = () => {
  if (newTask.value.trim() !== "") {
    tasks.value.push(newTask.value);
    newTask.value = "";
  }
};

const deleteTask = (index) => {
  tasks.value.splice(index, 1);
};

onMounted(async () => {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();
    tasks.value = data.map((post) => post.title);
  } catch (error) {
    console.log("error fetching tasks");
  }
});
</script>

<template>
  <h2>filter</h2>
  <h2>{{ name }}</h2>
  <p v-if="status === 'active'">Activated</p>
  <p v-else-if="status === 'pending'">Pending</p>
  <p v-else>Inactive</p>

  <form @submit.prevent="addTask">
    <label for="newTask">Add Task</label>
    <input type="text" id="newTask" name="newTask" v-model="newTask" />
    <button type="submit">Submit Task</button>
  </form>

  <h3>Tasks:</h3>

  <ul>
    <li v-for="(task, index) in tasks" :key="task">
      <span>
        {{ task }}
      </span>
      <button @click="deleteTask(index)">X</button>
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
