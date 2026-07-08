<!-- src/views/AchievementsView.vue -->
<template>
  <ion-page>
    <AppHeader @logout="handleLogout" />
    
    <ion-content>
      <div class="achievements-content">
        <div class="stats-header">
          <h2>🏆 Conquistas</h2>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-value">{{ totalDesbloqueadas }}</span>
              <span class="stat-label">Desbloqueadas</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ totalAchievements }}</span>
              <span class="stat-label">Total</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ progressoAchievements }}%</span>
              <span class="stat-label">Progresso</span>
            </div>
          </div>
          <ion-progress-bar :value="progressoAchievements / 100" color="primary" />
        </div>

        <ion-card>
          <ion-card-header>
            <ion-card-title>📊 Estatísticas do Álbum</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <div class="album-stats">
              <div class="stat-item">
                <span class="stat-value">{{ stats.coletadas }}</span>
                <span class="stat-label">Figurinhas</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ stats.raras }}</span>
                <span class="stat-label">Raras</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ stats.brilhantes }}</span>
                <span class="stat-label">Brilhantes</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">{{ stats.percentual }}%</span>
                <span class="stat-label">Álbum</span>
              </div>
            </div>
          </ion-card-content>
        </ion-card>

        <div class="achievements-list">
          <ion-spinner v-if="loading" name="crescent" class="spinner" />
          
          <div v-else>
            <ion-card 
              v-for="achievement in achievements" 
              :key="achievement.id"
              class="achievement-card"
              :class="{ desbloqueada: achievement.desbloqueada === 1 }"
            >
              <div class="achievement-icon">
                <ion-icon v-if="hasAchievementIcon(achievement.icone)" :icon="achievementIcon(achievement.icone)" />
                <span v-else>{{ achievement.icone }}</span>
                <ion-badge v-if="achievement.desbloqueada === 1" color="success" class="check-badge">
                  <ion-icon :icon="checkmarkCircle" />
                </ion-badge>
              </div>
              
              <ion-card-header>
                <ion-card-title>{{ achievement.nome }}</ion-card-title>
                <ion-card-subtitle>{{ achievement.descricao }}</ion-card-subtitle>
              </ion-card-header>

              <ion-card-content>
                <div class="achievement-status">
                  <ion-badge :color="achievement.desbloqueada === 1 ? 'success' : 'medium'">
                    {{ achievement.desbloqueada === 1 ? '✅ Desbloqueada' : '🔒 Bloqueada' }}
                  </ion-badge>
                  <span v-if="achievement.desbloqueada === 1 && achievement.data_desbloqueio" class="date">
                    {{ formatDate(achievement.data_desbloqueio) }}
                  </span>
                </div>
              </ion-card-content>
            </ion-card>
          </div>
        </div>
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
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  IonPage, IonContent, IonCard, IonCardHeader, IonCardTitle, 
  IonCardSubtitle, IonCardContent, IonBadge, IonIcon, IonSpinner,
  IonProgressBar, IonTabBar, IonTabButton, IonLabel
} from '@ionic/vue'
import {
  albumsOutline,
  bookOutline,
  checkmarkCircle,
  checkmarkCircleOutline,
  constructOutline,
  diamondOutline,
  flagOutline,
  personCircleOutline,
  podiumOutline,
  ribbonOutline,
  searchOutline,
  sparklesOutline,
  starOutline,
  trophyOutline
} from 'ionicons/icons'
import AppHeader from '../components/AppHeader.vue'
import { useAuth } from '../composables/useAuth'
import { useAchievements } from '../composables/useAchievements'

const router = useRouter()
const { logout } = useAuth()
const { 
  achievements, 
  totalAchievements, 
  totalDesbloqueadas, 
  progressoAchievements,
  stats, 
  loading, 
  carregarAchievements 
} = useAchievements()

const handleLogout = () => {
  logout()
  router.push('/login')
}

const formatDate = (date: string) => {
  if (!date) return ''
  const d = new Date(date)
  return d.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const goToAlbum = () => router.push('/album')
const goToCollected = () => router.push('/collected')
const goToAchievements = () => router.push('/achievements')
const goToProfile = () => router.push('/profile')

const achievementIcon = (icone: string) => {
  const icons: Record<string, string> = {
    albums: albumsOutline,
    book: bookOutline,
    construct: constructOutline,
    diamond: diamondOutline,
    flag: flagOutline,
    podium: podiumOutline,
    ribbon: ribbonOutline,
    search: searchOutline,
    sparkles: sparklesOutline,
    star: starOutline,
    trophy: trophyOutline
  }

  return icons[icone]
}

const hasAchievementIcon = (icone: string) => Boolean(achievementIcon(icone))

onMounted(() => carregarAchievements())
</script>

<style scoped>
.achievements-content { padding: 16px; }
.stats-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  padding: 20px;
  color: white;
  margin-bottom: 16px;
}
.stats-header h2 { margin: 0 0 16px 0; font-size: 1.5em; }
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 12px;
}
.stat-item { text-align: center; }
.stat-value { display: block; font-size: 1.8em; font-weight: bold; }
.stat-label { font-size: 0.8em; opacity: 0.8; }
.album-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  text-align: center;
}
.album-stats .stat-value { font-size: 1.4em; color: var(--ion-color-primary); }
.album-stats .stat-label { color: var(--ion-color-medium); }
.achievement-card {
  margin: 0 0 12px 0;
  transition: transform 0.2s;
  display: flex;
  align-items: center;
  padding: 12px;
}
.achievement-card.desbloqueada { border-left: 4px solid var(--ion-color-success); }
.achievement-icon {
  font-size: 3em;
  min-width: 60px;
  text-align: center;
  position: relative;
}
.achievement-icon ion-icon { font-size: 1em; }
.check-badge {
  position: absolute;
  top: -8px;
  right: -8px;
  font-size: 0.6em;
  padding: 2px 4px;
}
.achievement-card ion-card-header { flex: 1; padding: 0 12px; }
.achievement-card ion-card-title { font-size: 1em; margin: 0; }
.achievement-card ion-card-subtitle { font-size: 0.8em; margin: 0; }
.achievement-card ion-card-content { padding: 0; }
.achievement-status {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}
.achievement-status .date { font-size: 0.7em; color: var(--ion-color-medium); }
.spinner { display: flex; justify-content: center; align-items: center; height: 200px; }
</style>
