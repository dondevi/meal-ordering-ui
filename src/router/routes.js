
export default [
  { path: "/", redirect: "/calendar", component: () => import("layouts/default"), children: [
    { path: "calendar", component: () => import("pages/calendar") },
    { path: "kanban", component: () => import("pages/kanban") },
  ] },
  { path: "/login", component: () => import("layouts/login") },
  { path: "/logout", component: () => import("layouts/logout") },
  { path: "*", component: () => import("layouts/404") },
]
