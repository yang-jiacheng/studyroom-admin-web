<script setup lang="ts">

const goHome = () => {
  window.open(import.meta.env.VITE_APP_CONTEXT_PATH + '#/main', '_blank');
};
</script>

<template>
  <div class="container">
    <h1>404</h1>
    <p>No corresponding resource found on this server.</p>
    <button  class="button" @click="goHome" >Go back home</button>
  </div>
</template>

<style scoped>
body {
  background-color: #f5f5f5;
  font-family: 'Roboto', sans-serif;
  font-weight: 300;
  margin: 0;
  padding: 0;
}

.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 16px;
}

h1 {
  font-size: 96px;
  color: #818fee;
  margin: 0;
  line-height: 1;
  text-align: center;
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.2);
  animation: bounce 1s infinite alternate;
}

p {
  font-size: 24px;
  color: #424242;
  text-align: center;
  margin-top: 16px;
}

@keyframes bounce {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-20px);
  }
}

.button {
  display: inline-block;
  background-color: #818fee;
  color: #fff;
  font-size: 24px;
  font-weight: 500;
  padding: 16px 32px;
  border: none;
  border-radius: 35px;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  text-align: center;
  text-decoration: none;
  transition: background-color 0.3s;
  margin-top: 32px;
}

.button:hover {
  cursor: pointer;
  background-color: #d32f2f;
}
</style>
