<template>
  <ion-page>
    <ion-content>
      <div class="container">
        <RegisterForm @register="handleRegister" />
        
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
import { IonPage, IonContent, IonToast } from '@ionic/vue'
import RegisterForm from '../components/RegisterForm.vue'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { register, errorMessage } = useAuth()
const showToast = ref(false)
const toastMessage = ref('')
const toastColor = ref('danger')

const handleRegister = (name: string, email: string, password: string) => {
  const success = register(name, email, password)
  
  if (success) {
    toastMessage.value = 'Cadastro realizado com sucesso!'
    toastColor.value = 'success'
    showToast.value = true
    setTimeout(() => {
      router.push('/album')
    }, 1500)
  } else {
    toastMessage.value = errorMessage.value || 'Erro ao cadastrar'
    toastColor.value = 'danger'
    showToast.value = true
  }
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>