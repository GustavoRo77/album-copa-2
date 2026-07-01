// src/composables/useAlbum.ts
import { ref, computed, watch } from 'vue'
import { stickers as initialStickers } from '../data/stickersData'

const STORAGE_KEY = 'album_copa_stickers'

// Carregar do localStorage ou usar os dados iniciais
function loadStickers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const saved = JSON.parse(raw)
      // Mesclar com os dados iniciais para garantir que todos os campos existam
      return initialStickers.map(s => ({
        ...s,
        coletada: saved.find((x: any) => x.id === s.id)?.coletada ?? s.coletada
      }))
    }
  } catch {
    // ignore
  }
  return [...initialStickers]
}

const stickers = ref(loadStickers())

watch(
  stickers,
  (val) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(val.map(s => ({ id: s.id, coletada: s.coletada }))))
  },
  { deep: true }
)

export function useAlbum() {
  const searchQuery = ref('')
  const currentFilter = ref<'all' | 'collected' | 'pending'>('all')

  const filteredStickers = computed(() => {
    let result = stickers.value

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(s =>
        s.nome.toLowerCase().includes(query) ||
        s.selecao.toLowerCase().includes(query)
      )
    }

    if (currentFilter.value === 'collected') {
      result = result.filter(s => s.coletada === true)
    } else if (currentFilter.value === 'pending') {
      result = result.filter(s => s.coletada === false)
    }

    return result
  })

  const collectedStickers = computed(() => stickers.value.filter(s => s.coletada))

  const albumSummary = computed(() => {
    const total = stickers.value.length
    const collected = stickers.value.filter(s => s.coletada).length
    const percentage = total > 0 ? Math.round((collected / total) * 100) : 0
    return { total, collected, percentage }
  })

  const toggleCollected = (stickerId: number) => {
    const sticker = stickers.value.find(s => s.id === stickerId)
    if (sticker) {
      sticker.coletada = !sticker.coletada
    }
  }

  const searchStickers = (query: string) => {
    searchQuery.value = query
  }

  const setFilter = (filter: 'all' | 'collected' | 'pending') => {
    currentFilter.value = filter
  }

  return {
    stickers,
    filteredStickers,
    collectedStickers,
    albumSummary,
    searchQuery,
    currentFilter,
    toggleCollected,
    searchStickers,
    setFilter,
  }
}