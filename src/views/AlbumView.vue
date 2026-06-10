<template>
  <ion-page>
    <AppHeader @logout="handleLogout" />
    
    <ion-content>
      <div class="album-content">
        <div class="welcome-header" v-if="currentUser">
          <h2>Bem-vindo, {{ currentUser.name }}!</h2>
        </div>
        
        <StickerList 
          :filtered-stickers="filteredStickers"
          :album-summary="albumSummary"
          :search-query="searchQuery"
          :current-filter="currentFilter"
          @update:searchQuery="updateSearchQuery"
          @setFilter="setFilter"
          @toggleSticker="toggleCollected"
        />
      </div>
    </ion-content>
    
    <ion-tab-bar slot="bottom">
      <ion-tab-button tab="album" @click="goToAlbum">
        <ion-icon :icon="albumsOutline" />
        <ion-label>Álbum</ion-label>
      </ion-tab-button>
      
      <ion-tab-button tab="collected" @click="goToCollected">
        <ion-icon :icon="checkmarkCircleOutline" />
        <ion-label>Coletadas</ion-label>
        <ion-badge>{{ collectedCount }}</ion-badge>
      </ion-tab-button>
      
      <ion-tab-button tab="about" @click="goToAbout">
        <ion-icon :icon="informationCircleOutline" />
        <ion-label>Sobre</ion-label>
      </ion-tab-button>
    </ion-tab-bar>
  </ion-page>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  IonPage, 
  IonContent, 
  IonTabBar, 
  IonTabButton, 
  IonIcon, 
  IonLabel, 
  IonBadge 
} from '@ionic/vue'
import { albumsOutline, checkmarkCircleOutline, informationCircleOutline } from 'ionicons/icons'
import AppHeader from '../components/AppHeader.vue'
import StickerList from '../components/StickerList.vue'
import { useAuth } from '../composables/useAuth'
import { useAlbum } from '../composables/useAlbum'

const router = useRouter()
const { currentUser, logout } = useAuth()
const { 
  filteredStickers, 
  albumSummary, 
  searchQuery, 
  currentFilter, 
  toggleCollected,
  searchStickers,
  setFilter,
  collectedStickers
} = useAlbum()

const collectedCount = computed(() => collectedStickers.value.length)

const updateSearchQuery = (query: string) => {
  searchStickers(query)
}

const handleLogout = () => {
  logout()
  router.push('/login')
}

const goToAlbum = () => {
  // Already in album
}

const goToCollected = () => {
  router.push('/collected')
}

const goToAbout = () => {
  router.push('/about')
}
</script>

<style scoped>
.album-content {
  padding: 16px;
}

.welcome-header {
  text-align: center;
  margin-bottom: 20px;
  padding: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  color: white;
}

.welcome-header h2 {
  margin: 0;
  font-size: 1.5em;
}
</style>