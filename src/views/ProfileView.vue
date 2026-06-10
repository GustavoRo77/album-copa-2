<template>
  <ion-page>
    <AppHeader @logout="handleLogout" />
    
    <ion-content>
      <div class="profile-content" v-if="currentUser">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Perfil do Usuário</ion-card-title>
          </ion-card-header>
          
          <ion-card-content>
            <div class="profile-avatar">
              <ion-icon :icon="personCircleOutline" size="large" />
            </div>
            
            <ion-item>
              <ion-label>
                <h3>Nome completo</h3>
                <p>{{ currentUser.name }}</p>
              </ion-label>
            </ion-item>
            
            <ion-item>
              <ion-label>
                <h3>E-mail</h3>
                <p>{{ currentUser.email }}</p>
              </ion-label>
            </ion-item>
            
            <ion-item>
              <ion-label>
                <h3>ID do usuário</h3>
                <p>{{ currentUser.id }}</p>
              </ion-label>
            </ion-item>
          </ion-card-content>
        </ion-card>
        
        <ion-card>
          <ion-card-header>
            <ion-card-title>Estatísticas</ion-card-title>
          </ion-card-header>
          
          <ion-card-content>
            <div class="stats">
              <div class="stat-item">
                <h3>Total de figurinhas</h3>
                <p class="stat-value">{{ albumSummary.total }}</p>
              </div>
              <div class="stat-item">
                <h3>Coletadas</h3>
                <p class="stat-value success">{{ albumSummary.collected }}</p>
              </div>
              <div class="stat-item">
                <h3>Progresso</h3>
                <p class="stat-value">{{ albumSummary.percentage }}%</p>
              </div>
            </div>
            
            <ion-progress-bar :value="albumSummary.percentage / 100" />
          </ion-card-content>
        </ion-card>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { 
  IonPage, 
  IonContent, 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardContent, 
  IonItem, 
  IonLabel, 
  IonIcon,
  IonProgressBar 
} from '@ionic/vue'
import { personCircleOutline } from 'ionicons/icons'
import AppHeader from '../components/AppHeader.vue'
import { useAuth } from '../composables/useAuth'
import { useAlbum } from '../composables/useAlbum'

const router = useRouter()
const { currentUser, logout } = useAuth()
const { albumSummary } = useAlbum()

const handleLogout = () => {
  logout()
  router.push('/login')
}
</script>

<style scoped>
.profile-content {
  padding: 16px;
  max-width: 600px;
  margin: 0 auto;
}

.profile-avatar {
  text-align: center;
  margin-bottom: 20px;
}

.profile-avatar ion-icon {
  font-size: 100px;
  color: #667eea;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  text-align: center;
  margin-bottom: 20px;
}

.stat-item h3 {
  font-size: 0.9em;
  color: #666;
  margin-bottom: 8px;
}

.stat-value {
  font-size: 1.5em;
  font-weight: bold;
  margin: 0;
}

.stat-value.success {
  color: #28a745;
}

ion-progress-bar {
  margin-top: 10px;
}
</style>