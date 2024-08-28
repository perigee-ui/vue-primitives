<script setup lang="ts">
import './styles.css'
import { useToastProvider } from '../ToastProvider.ts'
import ToastViewport from '../ToastViewport.vue'
import ToastUpgradeAvailable from './ToastUpgradeAvailable.vue'

useToastProvider()
</script>

<template>
  <div>
    <input type="text">

    <div>
      <ToastUpgradeAvailable />
      <ToastViewport class="toast_viewportClass" />
    </div>

    <input type="text">
  </div>
</template>
