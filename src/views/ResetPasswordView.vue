<template>
  <ion-page>
    <ion-content>
      <div class="container">
        <ResetPasswordForm @reset="handleReset" />
        
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
import { IonPage, IonContent, IonToast } from '@ionic/vue'
import ResetPasswordForm from '../components/ResetPasswordForm.vue'
import { useAuth } from '../composables/useAuth'

const { resetPassword, errorMessage } = useAuth()
const showToast = ref(false)
const toastMessage = ref('')
const toastColor = ref('info')

const handleReset = (email: string) => {
  const success = resetPassword(email)
  
  if (success) {
    toastMessage.value = `E-mail de recuperação enviado para ${email}`
    toastColor.value = 'success'
    showToast.value = true
  } else {
    toastMessage.value = errorMessage.value || 'Erro ao enviar e-mail'
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