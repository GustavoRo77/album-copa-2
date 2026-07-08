<!-- src/views/AlbumView.vue -->
<template>
  <ion-page>
    <AppHeader @logout="handleLogout" />
    
    <ion-content>
      <div class="album-content">
        <div class="welcome-header" v-if="currentUser">
          <h2>Bem-vindo, {{ currentUser.nome || currentUser.name }}!</h2>
        </div>
        
        <ion-spinner v-if="loading" name="crescent" class="spinner" />
        
        <StickerList 
          v-else
          :filtered-stickers="filteredStickers"
          :album-summary="albumSummary"
          :search-query="searchQuery"
          :current-filter="currentFilter"
          @update:searchQuery="updateSearchQuery"
          @setFilter="setFilter"
          @toggleSticker="handleToggleSticker"
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
      
      <ion-tab-button tab="achievements" @click="goToAchievements">
        <ion-icon :icon="trophyOutline" />
        <ion-label>Conquistas</ion-label>
        <ion-badge v-if="totalDesbloqueadas > 0" color="warning">{{ totalDesbloqueadas }}</ion-badge>
      </ion-tab-button>
      
      <ion-tab-button tab="profile" @click="goToProfile">
        <ion-icon :icon="personCircleOutline" />
        <ion-label>Perfil</ion-label>
      </ion-tab-button>
    </ion-tab-bar>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { IonPage, IonContent, IonTabBar, IonTabButton, IonIcon, IonLabel, IonBadge, IonSpinner } from '@ionic/vue'
import { albumsOutline, checkmarkCircleOutline, personCircleOutline, trophyOutline } from 'ionicons/icons'
import AppHeader from '../components/AppHeader.vue'
import StickerList from '../components/StickerList.vue'
import { useAuth } from '../composables/useAuth'
import { useAlbum } from '../composables/useAlbum'
import { useAchievements } from '../composables/useAchievements'

const router = useRouter()
const { currentUser, logout } = useAuth()
const { filteredStickers, albumSummary, searchQuery, currentFilter, loading, toggleCollected, searchStickers, setFilter, carregarFigurinhas } = useAlbum()
const { totalDesbloqueadas, verificarAchievements } = useAchievements()

const collectedCount = computed(() => filteredStickers.value.filter(s => s.coletada).length)

const updateSearchQuery = async (query: string) => await searchStickers(query)

const handleToggleSticker = async (id: number) => {
  await toggleCollected(id)
  await verificarAchievements()
}

const handleLogout = () => { logout(); router.push('/login') }
const goToAlbum = () => {}
const goToCollected = () => router.push('/collected')
const goToAchievements = () => router.push('/achievements')
const goToProfile = () => router.push('/profile')

// Recarregar figurinhas quando a view for montada
onMounted(() => {
  carregarFigurinhas()
})
</script>

<style scoped>
.album-content { padding: 16px; }
.welcome-header {
  text-align: center;
  margin-bottom: 20px;
  padding: 10px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 10px;
  color: white;
}
.welcome-header h2 { margin: 0; font-size: 1.5em; }
.spinner { display: flex; justify-content: center; align-items: center; height: 200px; }
</style>