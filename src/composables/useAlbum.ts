import { ref, computed, watch } from 'vue'
import type { Sticker, FilterType, AlbumSummary } from '../types'
import { stickersData } from '../data/stickersData'

const STORAGE_KEY = 'album_copa_stickers'

function loadStickers(): Sticker[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const saved: { id: number; collected: boolean }[] = JSON.parse(raw)
      return stickersData.map(s => ({
        ...s,
        collected: saved.find(x => x.id === s.id)?.collected ?? s.collected
      }))
    }
  } catch {
    // ignore
  }
  return [...stickersData]
}

const stickers = ref<Sticker[]>(loadStickers())
const searchQuery = ref<string>('')
const currentFilter = ref<FilterType>('all')

watch(
  stickers,
  (val) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(val.map(s => ({ id: s.id, collected: s.collected }))))
  },
  { deep: true }
)

export function useAlbum() {
  const filteredStickers = computed(() => {
    let result = stickers.value

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(s =>
        s.name.toLowerCase().includes(query) ||
        s.country.toLowerCase().includes(query)
      )
    }

    if (currentFilter.value === 'collected') {
      result = result.filter(s => s.collected === true)
    } else if (currentFilter.value === 'pending') {
      result = result.filter(s => s.collected === false)
    }

    return result
  })

  const collectedStickers = computed(() => stickers.value.filter(s => s.collected))

  const albumSummary = computed<AlbumSummary>(() => {
    const total = stickers.value.length
    const collected = stickers.value.filter(s => s.collected).length
    const percentage = total > 0 ? (collected / total) * 100 : 0
    return { total, collected, percentage: Math.round(percentage) }
  })

  const toggleCollected = (stickerId: number) => {
    const sticker = stickers.value.find(s => s.id === stickerId)
    if (sticker) {
      sticker.collected = !sticker.collected
    }
  }

  const searchStickers = (query: string) => {
    searchQuery.value = query
  }

  const setFilter = (filter: FilterType) => {
    currentFilter.value = filter
  }

  const getStickersByGroup = (group: string) => stickers.value.filter(s => s.group === group)

  const groups = computed(() => Array.from(new Set(stickers.value.map(s => s.group))).sort())

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
    getStickersByGroup,
    groups
  }
}
