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
      this.$router.replace({
        name: "activity"
      });
    }
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
a {
  text-decoration: none;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}
</style>
