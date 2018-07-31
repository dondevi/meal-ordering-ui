<template>
  <q-layout view="hHh LpR fFf">

    <q-layout-header>
      <q-toolbar color="primary">
        <q-icon name="local_dining" size="25px" />
        <q-toolbar-title> 订餐 </q-toolbar-title>
        <span title="当前用户">{{ $session.user.member_name }}</span> &emsp;
        <q-btn icon="date_range" to="/calendar" flat round>
          <q-tooltip>日历视图</q-tooltip>
        </q-btn>
        <q-btn icon="table_chart" to="/kanban" flat round>
          <q-tooltip>看板视图</q-tooltip>
        </q-btn>
        <q-btn icon="power_settings_new" to="/logout" flat round>
          <q-tooltip>退出</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-layout-header>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<style scoped>
  .q-layout-header {
    box-shadow: none;
  }
</style>
