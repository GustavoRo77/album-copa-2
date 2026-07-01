<template>
  <ion-card class="sticker-card" :class="{ collected: sticker.coletada }">
    <div class="sticker-image-container">
      <img 
        v-if="!imageError"
        :src="sticker.foto" 
        :alt="sticker.nome"
        class="sticker-image"
        @error="handleImageError"
        loading="lazy"
      />
      <div v-else class="sticker-fallback" :class="rarityClass">
        {{ initials }}
      </div>
    </div>

    <ion-card-header>
      <ion-card-title>{{ sticker.nome }}</ion-card-title>
      <ion-card-subtitle>
        <ion-icon :icon="flagOutline" /> {{ sticker.selecao }}
      </ion-card-subtitle>
    </ion-card-header>

    <ion-card-content>
      <div class="badges">
        <ion-badge :color="rarityColor">
          <ion-icon :icon="rarityIcon" /> {{ sticker.raridade }}
        </ion-badge>
        <ion-badge :color="sticker.coletada ? 'success' : 'medium'">
          <ion-icon :icon="sticker.coletada ? checkmarkCircleOutline : timeOutline" />
          {{ sticker.coletada ? 'Coletada' : 'Pendente' }}
        </ion-badge>
      </div>

      <ion-button 
        expand="block" 
        :color="sticker.coletada ? 'danger' : 'success'" 
        @click="toggle"
      >
        <ion-icon :icon="sticker.coletada ? trashOutline : addCircleOutline" slot="start" />
        {{ sticker.coletada ? 'Remover' : 'Coletar' }}
      </ion-button>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardSubtitle, 
  IonCardContent, 
  IonButton, 
  IonBadge,
  IonIcon
} from '@ionic/vue'
import { 
  flagOutline, 
  checkmarkCircleOutline, 
  timeOutline, 
  trashOutline, 
  addCircleOutline,
  starOutline,
  sparklesOutline,
  ellipseOutline
} from 'ionicons/icons'

// Definindo o tipo do sticker diretamente no componente
interface Sticker {
  id: number
  nome: string
  selecao: string
  foto: string
  coletada: boolean
  raridade: string
  grupo: string
}

const props = defineProps<{ sticker: Sticker }>()
const emit = defineEmits<{ (e: 'toggle', id: number): void }>()
const imageError = ref(false)

const toggle = () => emit('toggle', props.sticker.id)

const initials = computed(() =>
  props.sticker.nome
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase()
)

const handleImageError = () => {
  imageError.value = true
}

const rarityColor = computed(() => {
  const colors: Record<string, string> = {
    'Brilhante': 'warning',
    'Rara': 'tertiary', 
    'Comum': 'medium'
  }
  return colors[props.sticker.raridade] || 'medium'
})

const rarityIcon = computed(() => {
  const icons: Record<string, any> = {
    'Brilhante': sparklesOutline,
    'Rara': starOutline,
    'Comum': ellipseOutline
  }
  return icons[props.sticker.raridade] || ellipseOutline
})

const rarityClass = computed(() => {
  const classes: Record<string, string> = {
    'Brilhante': 'brilhante',
    'Rara': 'rara',
    'Comum': 'comum'
  }
  return classes[props.sticker.raridade] || 'comum'
})
</script>

<style scoped>
.sticker-card {
  margin: 0;
  transition: transform 0.2s, box-shadow 0.2s;
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.sticker-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.sticker-card.collected {
  outline: 3px solid var(--ion-color-success);
  outline-offset: -1px;
}

.sticker-image-container {
  height: 200px;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  flex-shrink: 0;
}

.sticker-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.sticker-card:hover .sticker-image {
  transform: scale(1.05);
}

.sticker-fallback {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  font-weight: 900;
  letter-spacing: 4px;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.sticker-fallback.brilhante {
  background: linear-gradient(135deg, #f6d365, #fda085);
}

.sticker-fallback.rara {
  background: linear-gradient(135deg, #a18cd1, #fbc2eb);
}

.sticker-fallback.comum {
  background: linear-gradient(135deg, #667eea, #764ba2);
}

ion-card-header {
  flex-shrink: 0;
}

ion-card-title {
  font-size: 1.1rem;
  font-weight: 600;
}

ion-card-subtitle {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.9rem;
}

ion-card-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.badges {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.badges ion-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  font-size: 0.75rem;
}

ion-button {
  margin: 0;
  font-weight: 600;
}
</style>