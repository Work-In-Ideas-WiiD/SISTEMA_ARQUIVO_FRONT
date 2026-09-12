<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { trackCtaClick } from '@/utils/tracking'

function onTrialClick() {
  trackCtaClick('comecar_teste_gratis', 'free_trial_highlight')
}
</script>

<template>
  <section class="trial_highlight_section" aria-labelledby="trial-highlight-title">
    <div class="trial_container">
      <div class="trial_card">
        <div class="trial_glow" aria-hidden="true"></div>
        <div class="trial_badge">SEM COMPROMISSO</div>

        <h2 id="trial-highlight-title" class="trial_title">
          Teste o AkiDocs grátis por 8 dias
        </h2>

        <p class="trial_text">
          Conheça a plataforma na prática antes de contratar. Organize sua empresa, envie arquivos, configure permissões e veja como o AkiDocs funciona no seu dia a dia.
        </p>

        <div class="trial_actions">
          <RouterLink to="/cadastro" class="trial_btn" @click="onTrialClick">
            <span>COMEÇAR TESTE GRÁTIS</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </RouterLink>
        </div>

        <div class="trial_features">
          <span>✓ Sem necessidade de cartão no início</span>
          <span>✓ Acesso a todos os recursos</span>
          <span>✓ Suporte na configuração</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.trial_highlight_section {
  position: relative;
  padding: 40px 24px 80px;
  background: #212121;
}

.trial_container {
  max-width: 1040px;
  margin: 0 auto;
}

.trial_card {
  position: relative;
  background: radial-gradient(circle at 50% 30%, rgba(255, 0, 255, 0.15) 0%, rgba(33, 33, 33, 0.95) 75%), #252525;
  border: 1px solid rgba(255, 0, 255, 0.35);
  border-radius: 32px;
  padding: 56px 36px;
  text-align: center;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6), 0 0 40px rgba(255, 0, 255, 0.12);
  overflow: hidden;

  @media (max-width: 640px) {
    padding: 36px 20px;
  }
}

.trial_glow {
  position: absolute;
  top: -50px;
  left: 50%;
  transform: translateX(-50%);
  width: 400px;
  height: 200px;
  background: radial-gradient(circle, rgba(255, 0, 255, 0.25) 0%, transparent 70%);
  filter: blur(60px);
  pointer-events: none;
}

.trial_badge {
  display: inline-block;
  font-family: 'Source Code Pro', monospace;
  font-size: 11px;
  font-weight: 700;
  color: #ff00ff;
  letter-spacing: 1px;
  padding: 6px 14px;
  background: rgba(255, 0, 255, 0.12);
  border: 1px solid rgba(255, 0, 255, 0.3);
  border-radius: 20px;
  margin-bottom: 20px;
}

.trial_title {
  margin: 0 0 16px;
  font-family: 'Source Code Pro', monospace;
  font-size: clamp(28px, 3.2vw, 42px);
  font-weight: 800;
  color: #f7f7f7;
  line-height: 1.2;
}

.trial_text {
  margin: 0 auto 36px;
  font-family: 'Inter', sans-serif;
  font-size: clamp(15px, 1.2vw, 17px);
  line-height: 1.65;
  color: rgba(247, 247, 247, 0.8);
  max-width: 680px;
}

.trial_actions {
  display: flex;
  justify-content: center;
  margin-bottom: 28px;
}

.trial_btn {
  background: #f7f7f7;
  color: #212121;
  font-family: 'Source Code Pro', monospace;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0.5px;
  border-radius: 30px;
  padding: 16px 36px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  transition: all 0.25s ease;

  &:hover {
    background: #ffffff;
    box-shadow: 0 0 30px rgba(255, 0, 255, 0.6);
    transform: translateY(-2px);
  }
}

.trial_features {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 24px;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: rgba(247, 247, 247, 0.65);
}
</style>
