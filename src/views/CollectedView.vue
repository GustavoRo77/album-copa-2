<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/album" text="Voltar" />
        </ion-buttons>
        <ion-title>Coletadas ({{ collectedStickers.length }})</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div v-if="collectedStickers.length === 0" class="empty-state">
        <ion-icon :icon="sadOutline" />
        <p>Você ainda não tem figurinhas coletadas</p>
        <ion-button router-link="/album">Ir para o álbum</ion-button>
      </div>

      <div class="stickers-grid" v-else>
        <StickerCard
          v-for="sticker in collectedStickers"
          :key="sticker.id"
          :sticker="sticker"
          @toggle="toggleCollected"
        />
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonContent, IonIcon, IonButton } from '@ionic/vue'
import { sadOutline } from 'ionicons/icons'
import StickerCard from '../components/StickerCard.vue'
import { useAlbum } from '../composables/useAlbum'

const { collectedStickers, toggleCollected } = useAlbum()
</script>

<style scoped>
.stickers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
  padding: 16px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 60px 20px;
  text-align: center;
  color: var(--ion-color-medium);
}

.empty-state ion-icon {
  font-size: 64px;
}
</style>
