<template>
  <div>
    <h1>
      {{ title }}
      <el-button
        style="margin-left:20px;"
        type="default"
        size="mini"
        icon="el-icon-refresh"
        @click="refresh"
        >刷新</el-button
      >
    </h1>
    <el-popover class="logout" placement="top" width="160" v-model="visible">
      <p>确定退出登录吗？</p>
      <div style="text-align: right; margin: 0">
        <el-button size="mini" type="text" @click="visible = false"
          >取消</el-button
        >
        <el-button type="primary" size="mini" @click="logout">确定</el-button>
      </div>
      <el-button
        slot="reference"
        style="margin-left:20px;"
        type="danger"
        size="mini"
        icon="el-icon-close"
        >退出登录</el-button
      >
    </el-popover>
    <ul>
      <li v-for="(a, idx) in manageActivities" :key="a.activityId">
        <router-link
          :to="{ path: '/activity/nav', query: { id: a.activityId } }"
        >
          <el-tag :effect="idx % 2 === 0 ? 'dark' : 'plain'">
            {{ a.name }}
          </el-tag>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { Message } from "element-ui";
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      title: "活动列表",
      visible: false
    };
  },
  computed: {
    ...mapState("activity", ["manageActivities"])
  },
  methods: {
    ...mapActions("activity", ["getManageActivities"]),
    refresh() {
      this.getManageActivities().then(() => {
        Message.success({
          message: "刷新成功",
          showClose: true
        });
      });
    },
    logout() {
      localStorage.removeItem("token");
      window.location.href = "/";
      this.visible = false;
    }
  },
  mounted() {
    this.getManageActivities();
  }
};
</script>

<style scoped>
h1 {
  display: flex;
  align-items: center;
  justify-content: center;
}
ul {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  justify-content: center;
}
ul li {
  margin: 10px;
  font-weight: bold;
}
.logout {
  position: fixed;
  right: 20px;
  top: 20px;
}
</style>
