<template>
  <div>
    <h1>API Test</h1>
    <button @click="makeTestCall">Make Test Call</button>
    <p v-if="response">{{ response }}</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      response: "",
    };
  },
  methods: {
    async makeTestCall() {
      try {
        const result = await axios.post(
          "/api/index.php?route=log-contact-interaction",
          {
            contact_id: 1,
            user_id: 1,
            target_list_id: 1,
            next_contact_date: "2024-11-02T10:30:00",
            notes: "Follow-up needed",
            outcome: "Interested",
            contact_method: "call",
          }
        );
        this.response = result.data.message || "Success!";
      } catch (error) {
        this.response =
          "Error: " + error.response?.data?.message || error.message;
      }
    },
  },
};
</script>

<style scoped>
button {
  padding: 10px 20px;
  background-color: #42b983;
  color: #fff;
  border: none;
  cursor: pointer;
}
</style>
