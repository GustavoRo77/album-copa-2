<!-- src/components/ContatoList.vue -->
<template>
  <ion-list>
    <ion-item v-for="contato in contatos" :key="contato.id">
      <ion-label>
        <h2>{{ contato.nome }}</h2>
        <p>{{ contato.email }} | {{ contato.telefone }}</p>
      </ion-label>
      <ion-button fill="clear" color="danger" @click="deletarContato(contato.id)">
        <ion-icon :icon="trashOutline" />
      </ion-button>
    </ion-item>

    <ion-item v-if="contatos.length === 0">
      <ion-label class="ion-text-center">
        <p>Nenhum contato cadastrado</p>
      </ion-label>
    </ion-item>
  </ion-list>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { 
  IonList, 
  IonItem, 
  IonLabel, 
  IonButton, 
  IonIcon 
} from '@ionic/vue'
import { trashOutline } from 'ionicons/icons'
import { listContatos, deletarContato as deleteContato } from '../services/database'

const contatos = ref<any[]>([])

const carregarContatos = async () => {
  try {
    contatos.value = await listContatos()
  } catch (error) {
    console.error('Erro ao carregar contatos:', error)
  }
}

const deletarContato = async (id: number) => {
  if (confirm('Deseja realmente excluir este contato?')) {
    try {
      await deleteContato(id)
      await carregarContatos()
    } catch (error) {
      console.error('Erro ao deletar contato:', error)
    }
  }
}

onMounted(() => {
  carregarContatos()
})
</script>