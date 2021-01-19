<template>
  <div id="app">
    <v-app-bar height="90" class="flex-column" app>
      <h3 style="margin-bottom: 20px">Тестовое задание для SquareGPS</h3>
      <v-tabs height="50">
        <v-tab to="/">Home</v-tab>
        <v-tab to="/about">About</v-tab>
      </v-tabs>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </div>
</template>

<style>
.v-toolbar__content {
  flex-flow: column;
  align-items: flex-start !important;
  justify-content: flex-start !important;
}
</style>
