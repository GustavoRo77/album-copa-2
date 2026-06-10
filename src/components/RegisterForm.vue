<template>
  <div class="register-form">
    <ion-card>
      <ion-card-header>
        <ion-card-title>Cadastro</ion-card-title>
      </ion-card-header>

      <ion-card-content>
        <ion-item>
          <ion-label position="floating">Nome completo</ion-label>
          <ion-input v-model="name" type="text" required></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">E-mail</ion-label>
          <ion-input v-model="email" type="email" required></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Senha</ion-label>
          <ion-input v-model="password" type="password" required></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Confirmar senha</ion-label>
          <ion-input v-model="confirmPassword" type="password" required></ion-input>
        </ion-item>

        <ion-button expand="block" @click="handleRegister" class="register-button">
          Cadastrar
        </ion-button>

        <ion-button fill="clear" @click="goToLogin" class="login-button">
          Já tenho conta
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
  IonCardContent, 
  IonItem, 
  IonLabel, 
  IonInput, 
  IonButton 
} from '@ionic/vue'

const emit = defineEmits<{
  (e: 'register', name: string, email: string, password: string): void
}>()

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const handleRegister = () => {
  if (password.value !== confirmPassword.value) {
    alert('As senhas não conferem')
    return
  }
  emit('register', name.value, email.value, password.value)
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
.register-form {
  padding: 20px;
  max-width: 400px;
  margin: 0 auto;
}

.register-button {
  margin-top: 20px;
  --background: #007bff;
}

.login-button {
  margin-top: 10px;
}
</style>