<template>
  <ion-card class="sticker-card" :class="{ collected: props.sticker.collected }">
    <div class="sticker-avatar" :class="props.sticker.rarity">
      {{ initials }}
    </div>

    <ion-card-header>
      <ion-card-title>{{ props.sticker.name }}</ion-card-title>
      <ion-card-subtitle>{{ props.sticker.country }} · Grupo {{ props.sticker.group }}</ion-card-subtitle>
    </ion-card-header>

    <ion-card-content>
      <div class="badges">
        <ion-badge :color="rarityColor">{{ rarityLabel }}</ion-badge>
        <ion-badge :color="props.sticker.collected ? 'success' : 'medium'">
          {{ props.sticker.collected ? 'Coletada' : 'Pendente' }}
        </ion-badge>
      </div>

      <ion-button expand="block" :color="props.sticker.collected ? 'danger' : 'success'" @click="toggle">
        {{ props.sticker.collected ? 'Remover' : 'Coletar' }}
      </ion-button>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Sticker } from '../types'
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButton, IonBadge } from '@ionic/vue'

const props = defineProps<{ sticker: Sticker }>()
const emit = defineEmits<{ (e: 'toggle', id: number): void }>()

const toggle = () => emit('toggle', props.sticker.id)

const initials = computed(() =>
  props.sticker.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
)

const rarityColor = computed(() =>
  ({ brilhante: 'warning', rara: 'tertiary', comum: 'medium' })[props.sticker.rarity]
)

const rarityLabel = computed(() =>
  ({ brilhante: '✨ Brilhante', rara: '⭐ Rara', comum: 'Comum' })[props.sticker.rarity]
)
</script>

<style scoped>
.sticker-card {
  margin: 0;
  transition: transform 0.2s;
}

.sticker-card:hover {
  transform: translateY(-4px);
}

.sticker-card.collected {
  outline: 2px solid var(--ion-color-success);
}

.sticker-avatar {
  height: 130px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: 900;
  letter-spacing: 2px;
  border-radius: 8px 8px 0 0;
}

.sticker-avatar.brilhante {
  background: linear-gradient(135deg, #f6d365, #fda085);
  color: #7a4800;
}

.sticker-avatar.rara {
  background: linear-gradient(135deg, #a18cd1, #fbc2eb);
  color: #3d0066;
}

.sticker-avatar.comum {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.badges {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

ion-button {
  margin: 0;
}
</style>
