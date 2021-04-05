<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  mounted() {
    const { query } = this.$route;
    const { token } = query;
    if (token) {
      localStorage.setItem("token", token);
    }
    if (localStorage.getItem("token")) {
      this.$router.push({
        name: "activity"
      });
    }
    // 其它方式获取token
    // this.$api.user.login("1234", "dsd", 0, "313");
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
