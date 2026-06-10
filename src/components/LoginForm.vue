<template>
  <div class="login-form">
    <ion-card>
      <ion-card-header>
        <ion-card-title>Login</ion-card-title>
      </ion-card-header>

      <ion-card-content>
        <ion-item>
          <ion-label position="floating">E-mail</ion-label>
          <ion-input v-model="email" type="email" required></ion-input>
        </ion-item>

        <ion-item>
          <ion-label position="floating">Senha</ion-label>
          <ion-input v-model="password" type="password" required></ion-input>
        </ion-item>

        <ion-button expand="block" @click="handleLogin" class="login-button">
          Entrar
        </ion-button>

        <ion-button fill="clear" @click="goToRegister" class="register-button">
          Criar conta
        </ion-button>

        <ion-button fill="clear" @click="goToResetPassword" class="reset-button">
          Esqueceu a senha?
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
  (e: 'login', email: string, password: string): void
}>()

const router = useRouter()
const email = ref('')
const password = ref('')

const handleLogin = () => {
  emit('login', email.value, password.value)
}

const goToRegister = () => {
  router.push('/register')
}

const goToResetPassword = () => {
  router.push('/reset-password')
}
</script>

<style scoped>
.login-form {
  padding: 20px;
  max-width: 400px;
  margin: 0 auto;
}

.login-button {
  margin-top: 20px;
  --background: #28a745;
}

.register-button, .reset-button {
  margin-top: 10px;
}
</style>