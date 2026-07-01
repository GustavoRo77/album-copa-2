<!-- src/components/ContatoForm.vue -->
<template>
  <ion-card>
    <ion-card-header>
      <ion-card-title>Novo Contato</ion-card-title>
    </ion-card-header>

    <ion-card-content>
      <ion-item>
        <ion-label position="floating">Nome</ion-label>
        <ion-input v-model="nome" type="text" required></ion-input>
      </ion-item>

      <ion-item>
        <ion-label position="floating">E-mail</ion-label>
        <ion-input v-model="email" type="email" required></ion-input>
      </ion-item>

      <ion-item>
        <ion-label position="floating">Telefone</ion-label>
        <ion-input v-model="telefone" type="tel" required></ion-input>
      </ion-item>

      <ion-button expand="block" @click="salvarContato" color="primary">
        Salvar Contato
      </ion-button>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardContent, 
  IonItem, 
  IonLabel, 
  IonInput, 
  IonButton 
} from '@ionic/vue'
import { addContato } from '../services/database'

const nome = ref('')
const email = ref('')
const telefone = ref('')

const salvarContato = async () => {
  if (!nome.value || !email.value || !telefone.value) {
    alert('Preencha todos os campos')
    return
  }

  try {
    await addContato(nome.value, email.value, telefone.value)
    alert('Contato salvo com sucesso!')
    nome.value = ''
    email.value = ''
    telefone.value = ''
  } catch (error) {
    console.error('Erro ao salvar contato:', error)
    alert('Erro ao salvar contato')
  }
}
</script>