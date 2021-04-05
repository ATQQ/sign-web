import Home from "pages/home/index.vue";
const NotFind = () => import("pages/404/index.vue");
const Activity = () => import("pages/activity/index.vue");

const routes = [
  { path: "*", name: "404", component: NotFind },
  { path: "/", name: "home", component: Home },
  { path: "/activity", name: "activity", component: Activity }
];

export default routes;
