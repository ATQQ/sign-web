<template>
  <div>
    <h1>{{ title }}</h1>
    <ul>
      <li v-for="a in manageActivities" :key="a.activityId">
        {{ a.name }}
      </li>
    </ul>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      title: "活动列表"
    };
  },
  computed: {
    ...mapState("activity", ["manageActivities"])
  },
  methods: {
    ...mapActions("activity", ["getManageActivities"])
  },
  mounted() {
    this.getManageActivities();
  }
};
</script>

<style></style>
