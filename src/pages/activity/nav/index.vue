<template>
  <div>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-menu-item index="0">
        <el-page-header class="goback" @back="goBack" :content="title">
        </el-page-header>
      </el-menu-item>
      <el-menu-item index="1"
        ><router-link :to="{ name: 'sign-list', query }">签到列表</router-link>
      </el-menu-item>
      <el-menu-item index="2">
        <router-link :to="{ name: 'overview-status', query }"
          >总体签到概况</router-link
        >
      </el-menu-item>
    </el-menu>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      activeIndex: "1",
      query: {},
      title: "活动: ",
      activity: {}
    };
  },
  computed: {
    ...mapGetters("activity", ["getActivityById"])
  },
  methods: {
    handleSelect() {
      // console.log(e);
    },
    goBack() {
      this.$router.replace({
        name: "activity"
      });
    }
  },
  mounted() {
    this.query = this.$route.query;
    this.activity = this.getActivityById(this.query.id);
    this.title = this.title + this.activity.name;
    Object.assign(this.query, {
      title: this.title
    });
  }
};
</script>

<style scoped>
a {
  display: block;
  height: 100%;
}
.goback {
  display: flex;
  align-items: center;
  height: 100%;
}
</style>
