<template>
  <div class="overlay">
    <div class="container">
      <el-progress
        :percentage="percentage"
        :stroke-width="8"
        :duration="8"
        :show-text="false"
        striped
        striped-flow
        style="width: 300px;"
      />
      <p class="text">上传进度: {{ percentage }}%</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  percentage: number
}>();
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}
.container {
  text-align: center;
  color: #fff;
}
.text {
  margin-top: 10px;
}
</style>
