<script setup lang="ts"></script>

<template>
  <div class="menu">
    <router-link to="/iterative">迭代法</router-link>
    <router-link to="/normal">正规方程</router-link>
  </div>

  <router-view></router-view>
</template>

<style scoped>
.menu {
  position: absolute;
  top:40px;
  right: 30px;
  z-index: 1;
}
</style>
