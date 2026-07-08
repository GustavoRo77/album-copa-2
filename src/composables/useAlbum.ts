// src/composables/useAlbum.ts
import { ref, computed } from 'vue'
import { 
    getColecaoDoUsuario,
    toggleFigurinhaColetada,
    getFigurinhasColetadas,
    getFigurinhasPendentes,
    buscarFigurinhas
} from '../services/database'
import { useAuth } from './useAuth'

const { currentUser } = useAuth()

const stickers = ref<any[]>([])
const searchQuery = ref<string>('')
const currentFilter = ref<'all' | 'collected' | 'pending'>('all')
const loading = ref(false)

export function useAlbum() {
    const carregarFigurinhas = async () => {
        if (!currentUser.value) {
            console.log('⚠️ Nenhum usuário logado')
            stickers.value = []
            return
        }

        console.log('📊 Carregando figurinhas para usuário ID:', currentUser.value.id)

        loading.value = true
        try {
            let result = []

            if (searchQuery.value) {
                result = await buscarFigurinhas(Number(currentUser.value.id), searchQuery.value)
            } else if (currentFilter.value === 'collected') {
                result = await getFigurinhasColetadas(Number(currentUser.value.id))
            } else if (currentFilter.value === 'pending') {
                result = await getFigurinhasPendentes(Number(currentUser.value.id))
            } else {
                result = await getColecaoDoUsuario(Number(currentUser.value.id))
            }

            console.log('✅ Figurinhas carregadas:', result?.length || 0)

            stickers.value = result.map((row: any) => ({
                id: row.id,
                nome: row.nome,
                selecao: row.selecao,
                foto: row.foto,
                raridade: row.raridade,
                grupo: row.grupo,
                coletada: row.coletada === 1
            }))
        } catch (error) {
            console.error('❌ Erro ao carregar figurinhas:', error)
        } finally {
            loading.value = false
        }
    }

    const filteredStickers = computed(() => stickers.value)
    const collectedStickers = computed(() => stickers.value.filter(s => s.coletada))
    const albumSummary = computed(() => {
        const total = stickers.value.length
        const collected = stickers.value.filter(s => s.coletada).length
        const percentage = total > 0 ? Math.round((collected / total) * 100) : 0
        return { total, collected, percentage }
    })

    const toggleCollected = async (stickerId: number) => {
        if (!currentUser.value) return
        try {
            await toggleFigurinhaColetada(Number(currentUser.value.id), stickerId)
            await carregarFigurinhas()
        } catch (error) {
            console.error('❌ Erro ao alternar status:', error)
        }
    }

    const searchStickers = async (query: string) => {
        searchQuery.value = query
        await carregarFigurinhas()
    }

    const setFilter = async (filter: 'all' | 'collected' | 'pending') => {
        currentFilter.value = filter
        await carregarFigurinhas()
    }

    // Carregar dados iniciais
    carregarFigurinhas()

    return {
        stickers,
        filteredStickers,
        collectedStickers,
        albumSummary,
        searchQuery,
        currentFilter,
        loading,
        toggleCollected,
        searchStickers,
        setFilter,
        carregarFigurinhas
    }
}