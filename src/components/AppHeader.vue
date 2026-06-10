<template>
  <ion-header>
    <ion-toolbar>
      <ion-title>
        <div class="title-content">
          <ion-icon :icon="footballOutline" />
          <span>Álbum da Copa</span>
        </div>
      </ion-title>

      <ion-buttons slot="end">
        <ion-button @click="goToAbout">
          <ion-icon slot="icon-only" :icon="informationCircleOutline" />
        </ion-button>
        <ion-button @click="goToProfile">
          <ion-icon slot="icon-only" :icon="personOutline" />
        </ion-button>
        <ion-button @click="handleLogout">
          <ion-icon slot="icon-only" :icon="logOutOutline" />
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon
} from '@ionic/vue'
import { footballOutline, personOutline, logOutOutline, informationCircleOutline } from 'ionicons/icons'

const router = useRouter()
const emit = defineEmits<{
  (e: 'logout'): void
}>()

const goToProfile = () => {
  router.push('/profile')
}

const goToAbout = () => {
  router.push('/about')
}

const handleLogout = () => {
  emit('logout')
}
</script>

<style scoped>
.title-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.title-content ion-icon {
  font-size: 24px;
}
</style>
