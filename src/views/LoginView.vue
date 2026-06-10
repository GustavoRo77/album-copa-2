<template>
  <ion-page>
    <ion-content>
      <div class="container">
        <div class="logo-container">
          <ion-icon :icon="trophyOutline" size="large" class="logo-icon" />
          <h1>Álbum da Copa</h1>
        </div>
        
        <LoginForm @login="handleLogin" />
        
        <ion-toast
          :is-open="showToast"
          :message="toastMessage"
          :duration="3000"
          @did-dismiss="showToast = false"
          :color="toastColor"
        />
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { 
  IonPage, 
  IonContent, 
  IonIcon, 
  IonToast 
} from '@ionic/vue'
import { trophyOutline } from 'ionicons/icons'
import LoginForm from '../components/LoginForm.vue'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { login, errorMessage } = useAuth()
const showToast = ref(false)
const toastMessage = ref('')
const toastColor = ref('danger')

const handleLogin = (email: string, password: string) => {
  const success = login(email, password)
  
  if (success) {
    toastMessage.value = 'Login realizado com sucesso!'
    toastColor.value = 'success'
    showToast.value = true
    setTimeout(() => {
      router.push('/album')
    }, 1500)
  } else {
    toastMessage.value = errorMessage.value || 'Erro ao fazer login'
    toastColor.value = 'danger'
    showToast.value = true
  }
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.logo-container {
  text-align: center;
  margin-bottom: 30px;
}

.logo-icon {
  font-size: 80px;
  color: #ffd700;
}

h1 {
  color: white;
  font-size: 2em;
  margin-top: 20px;
}
</style>