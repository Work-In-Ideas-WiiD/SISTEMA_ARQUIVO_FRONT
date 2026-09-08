<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { trackEvent } from '@/utils/tracking'

function onStartClick() {
  trackEvent('clique_comecar_agora', { local: 'final_cta' })
}
</script>

<template>
  <section class="final_cta_section" aria-labelledby="cta-final-title">
    <div class="cta_glow" aria-hidden="true"></div>
    <div class="cta_watermark" aria-hidden="true">&lt;/DOC</div>

    <div class="final_cta_container">
      <span class="cta_badge">TRANSFORMAÇÃO DIGITAL</span>
      <h2 id="cta-final-title" class="cta_title">
        Pronto para transformar a gestão de documentos da sua empresa?
      </h2>
      <p class="cta_subtitle">
        Junte-se a empresas que já abandonaram a lentidão de arquivos físicos e pastas dispersas.
        Crie sua conta agora mesmo e organize sua operação em minutos.
      </p>

      <div class="cta_actions">
        <RouterLink to="/cadastro" class="cta_btn cta_btn--primary" @click="onStartClick">
          <span>COMEÇAR AGORA GRATUITAMENTE</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </RouterLink>

        <a
          href="https://wa.me/5562983398612"
          target="_blank"
          rel="noopener noreferrer"
          class="cta_btn cta_btn--secondary"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#25D366" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
          <span>FALAR NO WHATSAPP</span>
        </a>
      </div>

      <p class="cta_direct_contact">
        Ou envie uma mensagem para <a href="mailto:contato@wi-id.com">contato@wi-id.com</a>
      </p>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.final_cta_section {
  position: relative;
  padding: 110px 24px;
  background: radial-gradient(circle at 50% 50%, rgba(255, 0, 255, 0.15) 0%, rgba(33, 33, 33, 1) 85%),
              #212121;
  border-top: 1px solid rgba(247, 247, 247, 0.08);
  overflow: hidden;
  text-align: center;
}

.cta_glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 350px;
  background: radial-gradient(circle, rgba(255, 0, 255, 0.22) 0%, transparent 70%);
  filter: blur(80px);
  pointer-events: none;
}

.cta_watermark {
  position: absolute;
  z-index: 0;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: 'Source Code Pro', monospace;
  font-size: clamp(120px, 20vw, 240px);
  font-weight: 800;
  line-height: 0.8;
  color: #f7f7f7;
  opacity: 0.03;
  pointer-events: none;
  user-select: none;
  white-space: nowrap;
}

.final_cta_container {
  position: relative;
  z-index: 2;
  max-width: 840px;
  margin: 0 auto;
}

.cta_badge {
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

.cta_title {
  margin: 0 0 20px;
  font-family: 'Source Code Pro', monospace;
  font-size: clamp(28px, 3.2vw, 42px);
  font-weight: 800;
  color: #f7f7f7;
  line-height: 1.2;
}

.cta_subtitle {
  margin: 0 0 40px;
  font-family: 'Inter', sans-serif;
  font-size: clamp(15px, 1.2vw, 17px);
  font-weight: 400;
  line-height: 1.6;
  color: rgba(247, 247, 247, 0.8);
  max-width: 680px;
  margin-left: auto;
  margin-right: auto;
}

.cta_actions {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 16px;
}

.cta_btn {
  font-family: 'Source Code Pro', monospace;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: 0.5px;
  border-radius: 30px;
  padding: 16px 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.25s ease;
  text-decoration: none;

  &--primary {
    background: #f7f7f7;
    color: #212121;
    border: none;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);

    &:hover {
      background: #ffffff;
      box-shadow: 0 0 30px rgba(255, 0, 255, 0.6);
      transform: translateY(-2px);
    }
  }

  &--secondary {
    background: rgba(121, 121, 121, 0.2);
    color: #f7f7f7;
    border: 1px solid rgba(247, 247, 247, 0.3);
    backdrop-filter: blur(10px);

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: #ff00ff;
      color: #ff00ff;
      transform: translateY(-2px);
    }
  }
}

.cta_direct_contact {
  margin: 24px 0 0;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: rgba(247, 247, 247, 0.6);

  a {
    color: #ff00ff;
    text-decoration: underline;
    font-weight: 500;

    &:hover {
      color: #ffffff;
    }
  }
}
</style>
