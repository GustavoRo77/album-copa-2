<!-- src/App.vue -->
<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>
 
<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { onMounted } from 'vue';
import { initDatabase } from './services/database';

onMounted(async () => {
  try {
    console.log('🚀 Iniciando banco de dados...');
    await initDatabase();
    console.log('✅ Banco de dados inicializado com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao inicializar banco:', error);
  }
});
</script>