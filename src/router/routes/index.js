import Home from "pages/home/index.vue";
const NotFind = () => import("pages/404/index.vue");
const Activity = () => import("pages/activity/index.vue");
const ActivityNav = () => import("pages/activity/nav/index.vue");
const ActivityOverview = () => import("pages/activity/nav/overview/index.vue");
const ActivitySignList = () => import("pages/activity/nav/sign-list/index.vue");

const routes = [
  { path: "*", name: "404", component: NotFind },
  { path: "/", name: "home", component: Home },
  { path: "/activity", name: "activity", component: Activity },
  {
    path: "/activity/nav",
    name: "activity-nav",
    redirect: "/activity/nav/overview",
    component: ActivityNav,
    children: [
      {
        path: "overview",
        name: "overview-status",
        component: ActivityOverview
      },
      { path: "sign", name: "sign-list", component: ActivitySignList }
    ]
  }
];

export default routes;
