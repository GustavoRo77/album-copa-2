<template>
  <div class="sticker-list">
    <ion-searchbar
      :value="searchQuery"
      placeholder="Pesquisar jogador ou seleção"
      @ionInput="(ev: CustomEvent) => emit('update:searchQuery', ev.detail.value || '')"
    />

    <div class="filters">
      <ion-button size="small" :fill="currentFilter === 'all' ? 'solid' : 'outline'" color="primary" @click="emit('setFilter', 'all')">Todas</ion-button>
      <ion-button size="small" :fill="currentFilter === 'collected' ? 'solid' : 'outline'" color="success" @click="emit('setFilter', 'collected')">Coletadas</ion-button>
      <ion-button size="small" :fill="currentFilter === 'pending' ? 'solid' : 'outline'" color="danger" @click="emit('setFilter', 'pending')">Pendentes</ion-button>
    </div>

    <p class="summary">{{ albumSummary.collected }} / {{ albumSummary.total }} figurinhas — {{ albumSummary.percentage }}%</p>

    <div v-if="filteredStickers.length === 0" class="empty-state">
      <ion-icon :icon="sadOutline" />
      <p>Nenhuma figurinha encontrada</p>
    </div>

    <div class="grid" v-else>
      <StickerCard
        v-for="sticker in filteredStickers"
        :key="sticker.id"
        :sticker="sticker"
        @toggle="(id) => emit('toggleSticker', id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Sticker, FilterType, AlbumSummary } from '../types'
import { IonSearchbar, IonButton, IonIcon } from '@ionic/vue'
import { sadOutline } from 'ionicons/icons'
import StickerCard from './StickerCard.vue'

defineProps<{
  filteredStickers: Sticker[]
  albumSummary: AlbumSummary
  searchQuery: string
  currentFilter: FilterType
}>()

const emit = defineEmits<{
  (e: 'update:searchQuery', value: string): void
  (e: 'setFilter', filter: FilterType): void
  (e: 'toggleSticker', id: number): void
}>()
</script>

<style scoped>
.sticker-list {
  padding: 12px;
}

.filters {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin: 8px 0;
}

.summary {
  text-align: center;
  color: var(--ion-color-medium);
  font-size: 0.9rem;
  margin: 4px 0 12px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 40px;
  color: var(--ion-color-medium);
}

.empty-state ion-icon {
  font-size: 56px;
}
</style>
