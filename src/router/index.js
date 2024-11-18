import { createRouter, createWebHistory } from "vue-router";

import HomeView from "@/views/HomeView.vue";
import TargetLists from "@/views/TargetListsView.vue"; // JobsView
import NotFoundView from "@/views/NotFoundView.vue";
import TargetListView from "@/views/TargetListView.vue"; // JobView
import InteractionHistory from "@/views/InteractionHistory.vue";
import EditJobView from "@/views/EditJobView.vue";
import TestComponent from "@/components/TestComponent.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/jobs",
      name: "jobs",
      component: TargetLists, // JobsView
    },
    {
      path: "/jobs/:id",
      name: "job",
      component: TargetListView, // JobView
    },
    {
      path: "/jobs/add",
      name: "add-job",
      component: InteractionHistory,
    },
    {
      path: "/test",
      name: "test-component",
      component: TestComponent,
    },

    {
      path: "/jobs/edit/:id",
      name: "edit-job",
      component: EditJobView,
    },
    {
      path: "/:catchAll(.*)",
      name: "not-found",
      component: NotFoundView,
    },
  ],
});

export default router;
