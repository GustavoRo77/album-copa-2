// src/composables/useAchievements.ts
import { ref, computed } from 'vue'
import { 
    getAchievements,
    getAchievementsDesbloqueadas,
    getStatsUsuario,
    verificarEAtualizarAchievements 
} from '../services/database'
import { useAuth } from './useAuth'

const { currentUser } = useAuth()

const achievements = ref<any[]>([])
const achievementsDesbloqueadas = ref<any[]>([])
const stats = ref({
    total: 0,
    coletadas: 0,
    raras: 0,
    brilhantes: 0,
    percentual: 0
})
const loading = ref(false)

export function useAchievements() {
    const carregarAchievements = async () => {
        if (!currentUser.value) {
            achievements.value = []
            achievementsDesbloqueadas.value = []
            return
        }

        loading.value = true
        try {
            await verificarEAtualizarAchievements(Number(currentUser.value.id))
            const [achievementsData, desbloqueadasData, statsData] = await Promise.all([
                getAchievements(Number(currentUser.value.id)),
                getAchievementsDesbloqueadas(Number(currentUser.value.id)),
                getStatsUsuario(Number(currentUser.value.id))
            ])
            
            achievements.value = achievementsData
            achievementsDesbloqueadas.value = desbloqueadasData
            stats.value = statsData
        } catch (error) {
            console.error('Erro ao carregar conquistas:', error)
        } finally {
            loading.value = false
        }
    }

    const verificarAchievements = async () => {
        if (!currentUser.value) return 0
        
        try {
            const result = await verificarEAtualizarAchievements(Number(currentUser.value.id))
            achievements.value = result.achievements
            const desbloqueadas = await getAchievementsDesbloqueadas(Number(currentUser.value.id))
            achievementsDesbloqueadas.value = desbloqueadas
            const statsData = await getStatsUsuario(Number(currentUser.value.id))
            stats.value = statsData
            return result.novasDesbloqueadas
        } catch (error) {
            console.error('Erro ao verificar conquistas:', error)
            return 0
        }
    }

    const totalAchievements = computed(() => achievements.value.length)
    const totalDesbloqueadas = computed(() => achievementsDesbloqueadas.value.length)
    const progressoAchievements = computed(() => {
        const total = totalAchievements.value
        return total > 0 ? Math.round((totalDesbloqueadas.value / total) * 100) : 0
    })

    carregarAchievements()

    return {
        achievements,
        achievementsDesbloqueadas,
        stats,
        loading,
        totalAchievements,
        totalDesbloqueadas,
        progressoAchievements,
        carregarAchievements,
        verificarAchievements
    }
}
