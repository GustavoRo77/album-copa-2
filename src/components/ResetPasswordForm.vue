<template>
  <div class="reset-form">
    <ion-card>
      <ion-card-header>
        <ion-card-title>Recuperar senha</ion-card-title>
        <ion-card-subtitle>
          Digite seu e-mail para receber as instruções
        </ion-card-subtitle>
      </ion-card-header>

      <ion-card-content>
        <ion-item>
          <ion-label position="floating">E-mail</ion-label>
          <ion-input v-model="email" type="email" required></ion-input>
        </ion-item>

        <ion-button expand="block" @click="handleReset" class="reset-button">
          Enviar e-mail
        </ion-button>

        <ion-button fill="clear" @click="goToLogin" class="login-button">
          Voltar para login
        </ion-button>
      </ion-card-content>
    </ion-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { 
  IonCard, 
  IonCardHeader, 
  IonCardTitle, 
  IonCardSubtitle, 
  IonCardContent, 
  IonItem, 
  IonLabel, 
  IonInput, 
  IonButton 
} from '@ionic/vue'

const emit = defineEmits<{
  (e: 'reset', email: string): void
}>()

const router = useRouter()
const email = ref('')

const handleReset = () => {
  emit('reset', email.value)
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
.reset-form {
  padding: 20px;
  max-width: 400px;
  margin: 0 auto;
}

.reset-button {
  margin-top: 20px;
  --background: #ffc107;
  --color: #000;
}

.login-button {
  margin-top: 10px;
}
</style>