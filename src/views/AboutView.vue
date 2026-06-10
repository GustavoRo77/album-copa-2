<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/album" />
        </ion-buttons>
        <ion-title>Sobre</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="about-container">
        <div class="logo-section">
          <ion-icon :icon="trophyOutline" class="about-icon" />
          <h1>Álbum da Copa</h1>
          <ion-badge color="primary" class="version-badge">v{{ appVersion }}</ion-badge>
        </div>

        <p class="description">
          Gerencie sua coleção de figurinhas da Copa do Mundo. Marque as figurinhas que você já tem e acompanhe seu progresso!
        </p>

        <ion-list lines="full" class="links-list">
          <ion-item button @click="openTerms">
            <ion-icon :icon="documentTextOutline" slot="start" color="primary" />
            <ion-label>Termos de Uso</ion-label>
            <ion-icon :icon="chevronForwardOutline" slot="end" />
          </ion-item>

          <ion-item button @click="openPrivacy">
            <ion-icon :icon="lockClosedOutline" slot="start" color="primary" />
            <ion-label>Política de Privacidade</ion-label>
            <ion-icon :icon="chevronForwardOutline" slot="end" />
          </ion-item>
        </ion-list>

        <ion-modal :is-open="showTerms" @did-dismiss="showTerms = false">
          <ion-header>
            <ion-toolbar>
              <ion-title>Termos de Uso</ion-title>
              <ion-buttons slot="end">
                <ion-button @click="showTerms = false">Fechar</ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>
          <ion-content class="ion-padding">
            <h2>Termos de Uso</h2>
            <p>Ao usar o Álbum da Copa, você concorda com os seguintes termos:</p>
            <p><strong>1. Uso do Aplicativo</strong><br />Este aplicativo é fornecido para uso pessoal e não comercial. É proibida a reprodução ou distribuição sem autorização.</p>
            <p><strong>2. Responsabilidades</strong><br />O usuário é responsável por manter a confidencialidade de seus dados de acesso.</p>
            <p><strong>3. Alterações</strong><br />Reservamos o direito de modificar estes termos a qualquer momento, com aviso prévio aos usuários.</p>
            <p><strong>4. Contato</strong><br />Para dúvidas, entre em contato pelo suporte do aplicativo.</p>
          </ion-content>
        </ion-modal>

        <ion-modal :is-open="showPrivacy" @did-dismiss="showPrivacy = false">
          <ion-header>
            <ion-toolbar>
              <ion-title>Política de Privacidade</ion-title>
              <ion-buttons slot="end">
                <ion-button @click="showPrivacy = false">Fechar</ion-button>
              </ion-buttons>
            </ion-toolbar>
          </ion-header>
          <ion-content class="ion-padding">
            <h2>Política de Privacidade</h2>
            <p>Sua privacidade é importante para nós.</p>
            <p><strong>1. Dados Coletados</strong><br />Coletamos apenas nome, e-mail e preferências de uso dentro do aplicativo. Nenhum dado é compartilhado com terceiros.</p>
            <p><strong>2. Armazenamento</strong><br />Seus dados são armazenados localmente no dispositivo e não são enviados a servidores externos.</p>
            <p><strong>3. Seus Direitos</strong><br />Você pode solicitar a exclusão de seus dados a qualquer momento através das configurações do aplicativo.</p>
            <p><strong>4. Segurança</strong><br />Utilizamos boas práticas de segurança para proteger suas informações.</p>
          </ion-content>
        </ion-modal>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonButton,
  IonBadge,
  IonIcon,
  IonList,
  IonItem,
  IonLabel,
  IonModal
} from '@ionic/vue'
import { trophyOutline, documentTextOutline, lockClosedOutline, chevronForwardOutline } from 'ionicons/icons'

const appVersion = '1.0.0'
const showTerms = ref(false)
const showPrivacy = ref(false)

const openTerms = () => { showTerms.value = true }
const openPrivacy = () => { showPrivacy.value = true }
</script>

<style scoped>
.about-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 24px 0;
}

.logo-section {
  text-align: center;
  margin-bottom: 24px;
}

.about-icon {
  font-size: 80px;
  color: #ffd700;
}

.logo-section h1 {
  font-size: 1.8em;
  margin: 12px 0 8px;
}

.version-badge {
  font-size: 14px;
  padding: 6px 12px;
}

.description {
  text-align: center;
  color: var(--ion-color-medium);
  margin-bottom: 32px;
  line-height: 1.6;
}

.links-list {
  border-radius: 12px;
  overflow: hidden;
}
</style>
