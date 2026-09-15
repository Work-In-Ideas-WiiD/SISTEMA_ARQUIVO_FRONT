<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { trackCtaClick, trackEvent } from '@/utils/tracking'

function onStartClick() {
  trackCtaClick('comecar_agora', 'hero')
}

function scrollToPricing() {
  trackCtaClick('ver_planos', 'hero')
  trackEvent('selecionar_plano', { local: 'hero_secundario' })
  const el = document.querySelector('#planos')
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <section class="hero_section" aria-labelledby="hero-title">
    <!-- Signature background watermark </DOC -->
    <div class="hero_watermark" aria-hidden="true">&lt;/DOC</div>

    <!-- Video background com overlay escuro -->
    <div class="hero_video_container" aria-hidden="true">
      <video
        class="hero_video_bg"
        autoplay
        loop
        muted
        playsinline
      >
        <source src="/videos/hero-catalog-bg.mp4" type="video/mp4" />
      </video>
      <div class="hero_video_overlay"></div>
    </div>

    <!-- Ambient glow lights -->
    <div class="hero_glow hero_glow--magenta" aria-hidden="true"></div>
    <div class="hero_glow hero_glow--subtle" aria-hidden="true"></div>

    <div class="hero_container">
      <div class="hero_content">
        <div class="hero_tag" role="status">
          <span class="hero_tag__dot" aria-hidden="true"></span>
          GESTÃO DOCUMENTAL NA NUVEM PARA EMPRESAS
        </div>

        <h1 id="hero-title" class="hero_title">
          Todos os seus documentos, Aki!
        </h1>

        <p class="hero_subtitle">
          Compartilhe os arquivos da sua empresa com funcionários e clientes, sem limite de acessos para clientes, de modo seguro, organizado e com confirmação de leitura.
        </p>

        <p class="hero_description">
          Centralize documentos por empresa, setor, função e usuário, controle quem pode acessar cada arquivo e acompanhe os acessos em um único ambiente.
        </p>

        <div class="hero_actions">
          <RouterLink to="/cadastro" class="hero_btn hero_btn--primary" @click="onStartClick">
            <span>TESTAR GRÁTIS POR 8 DIAS</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </RouterLink>

          <button type="button" class="hero_btn hero_btn--secondary" @click="scrollToPricing">
            VER PLANOS E PREÇOS
          </button>
        </div>
      </div>

      <!-- Realistic UI Showcase Mockup -->
      <div class="hero_visual" aria-hidden="true">
        <div class="mockup_window">
          <!-- Window Header -->
          <div class="mockup_header">
            <div class="mockup_dots">
              <span class="mockup_dot mockup_dot--red"></span>
              <span class="mockup_dot mockup_dot--yellow"></span>
              <span class="mockup_dot mockup_dot--green"></span>
            </div>
            <div class="mockup_address">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <span>app.akidocs.com.br/dashboard</span>
            </div>
            <div class="mockup_user">
              <span class="mockup_avatar">AD</span>
            </div>
          </div>

          <!-- Window Body -->
          <div class="mockup_body">
            <!-- Mockup Sidebar -->
            <div class="mockup_sidebar">
              <div class="mockup_nav_item mockup_nav_item--active">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                </svg>
                <span>Arquivos</span>
              </div>
              <div class="mockup_nav_item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                </svg>
                <span>Clientes</span>
              </div>
              <div class="mockup_nav_item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                  <polyline points="2 17 12 22 22 17"></polyline>
                  <polyline points="2 12 12 17 22 12"></polyline>
                </svg>
                <span>Setores</span>
              </div>
              <div class="mockup_nav_item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>Usuários</span>
              </div>
            </div>

            <!-- Mockup Main Panel -->
            <div class="mockup_content">
              <!-- KPI Cards -->
              <div class="mockup_kpis">
                <div class="kpi_card">
                  <span class="kpi_label">ARQUIVOS ARMAZENADOS</span>
                  <span class="kpi_val">1.420</span>
                </div>
                <div class="kpi_card">
                  <span class="kpi_label">ARMAZENAMENTO</span>
                  <div class="kpi_progress_wrap">
                    <div class="kpi_progress_bar" style="width: 25%"></div>
                  </div>
                  <span class="kpi_sub">24.8 GB de 100 GB</span>
                </div>
                <div class="kpi_card">
                  <span class="kpi_label">LEITURAS CONFIRMADAS</span>
                  <span class="kpi_val kpi_val--accent">98.4%</span>
                </div>
              </div>

              <!-- Document List Preview -->
              <div class="mockup_table">
                <div class="table_row table_row--header">
                  <span>DOCUMENTO</span>
                  <span>SETOR</span>
                  <span>CONFIRMAÇÃO</span>
                </div>
                <div class="table_row">
                  <div class="doc_cell">
                    <span class="doc_icon">PDF</span>
                    <span>Manual_Integracao_Colaborador.pdf</span>
                  </div>
                  <span class="text_muted">RH</span>
                  <span class="badge badge--success">Confirmado</span>
                </div>
                <div class="table_row">
                  <div class="doc_cell">
                    <span class="doc_icon">PDF</span>
                    <span>Balancete_Gerencial_Q1.pdf</span>
                  </div>
                  <span class="text_muted">Financeiro</span>
                  <span class="badge badge--success">Confirmado</span>
                </div>
                <div class="table_row">
                  <div class="doc_cell">
                    <span class="doc_icon">PDF</span>
                    <span>Relatorio_Atividades_Cliente.pdf</span>
                  </div>
                  <span class="text_muted">Atendimento</span>
                  <span class="badge badge--info">Disponível</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Floating Interactive Badges -->
        <div class="floating_badge floating_badge--left">
          <span class="badge_icon">🔒</span>
          <div>
            <strong>Arquivos Criptografados</strong>
            <small>Segurança na infraestrutura</small>
          </div>
        </div>

        <div class="floating_badge floating_badge--right">
          <span class="badge_icon">👥</span>
          <div>
            <strong>Acessos Ilimitados</strong>
            <small>Para seus clientes</small>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.hero_section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 130px 24px 80px;
  box-sizing: border-box;
  background: radial-gradient(circle at 80% 20%, #1F3A5F, #0B1B2B 70%), #0B1B2B;
  overflow: hidden;
}

.hero_video_container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
}

.hero_video_bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.28;
  filter: saturate(0.85) contrast(1.1);
}

.hero_video_overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 80% 20%, rgba(31, 58, 95, 0.75) 0%, rgba(11, 27, 43, 0.92) 60%, #0B1B2B 100%);
}

.hero_watermark {
  position: absolute;
  z-index: 1;
  top: 45%;
  right: -5vw;
  transform: translateY(-50%);
  font-family: 'Inter', sans-serif;
  font-size: clamp(140px, 24vw, 320px);
  font-weight: 800;
  line-height: 0.8;
  color: #FFFCFF;
  opacity: 0.03;
  pointer-events: none;
  user-select: none;
  white-space: nowrap;
}

.hero_glow {
  position: absolute;
  pointer-events: none;
  border-radius: 50%;
  filter: blur(120px);
  z-index: 1;

  &--magenta {
    top: 10%;
    right: 15%;
    width: 450px;
    height: 450px;
    background: #1F3A5F59;
  }

  &--subtle {
    bottom: 5%;
    left: 5%;
    width: 380px;
    height: 380px;
    background: #FFFCFF0D;
  }
}

.hero_container {
  position: relative;
  z-index: 2;
  max-width: 1240px;
  width: 100%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1.05fr;
  gap: 56px;
  align-items: center;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 48px;
    text-align: center;
  }
}

.hero_content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  @media (max-width: 1024px) {
    align-items: center;
  }
}

.hero_tag {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  border-radius: 30px;
  background: #1F2933;
  border: 1px solid #B08D57;
  color: #FFFCFF;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.8px;
  margin-bottom: 24px;
}

.hero_tag__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #B08D57;
  box-shadow: 0 0 10px #B08D57;
}

.hero_title {
  margin: 0 0 16px;
  font-family: 'Inter', sans-serif;
  font-size: clamp(32px, 3.4vw, 50px);
  font-weight: 800;
  line-height: 1.15;
  color: #FFFCFF;
  letter-spacing: -0.5px;
}

.hero_subtitle {
  margin: 0 0 16px;
  font-family: 'Inter', sans-serif;
  font-size: clamp(17px, 1.3vw, 20px);
  font-weight: 600;
  line-height: 1.5;
  color: #FFFFFF;
  max-width: 580px;
}

.hero_description {
  margin: 0 0 36px;
  font-family: 'Inter', sans-serif;
  font-size: clamp(15px, 1.1vw, 16px);
  font-weight: 400;
  line-height: 1.6;
  color: rgba(255, 252, 255, 0.72);
  max-width: 540px;
}

.hero_actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 0;
}

.hero_btn {
  font-family: 'Inter', sans-serif;
  font-size: 15px;
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
    background: #B08D57;
    color: #FFFFFF;
    border: none;
    box-shadow: 0 4px 20px rgba(11, 27, 43, 0.6);

    &:hover {
      background: #FFFCFF;
      color: #0B1B2B;
      box-shadow: 0 0 25px rgba(176, 141, 87, 0.5);
      transform: translateY(-2px);
    }
  }

  &--secondary {
    background: #1F2933;
    color: #FFFCFF;
    border: 1px solid rgba(255, 252, 255, 0.25);
    backdrop-filter: blur(10px);

    &:hover {
      background: rgba(255, 252, 255, 0.1);
      border-color: #B08D57;
      color: #B08D57;
      transform: translateY(-2px);
    }
  }
}

/* Visual UI Showcase Mockup */
.hero_visual {
  position: relative;
  width: 100%;
}

.mockup_window {
  width: 100%;
  background: #1F2933;
  border: 1px solid rgba(255, 252, 255, 0.15);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 24px 60px rgba(11, 27, 43, 0.8), 0 0 40px rgba(31, 58, 95, 0.2);
}

.mockup_header {
  height: 44px;
  background: #0B1B2B;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid rgba(255, 252, 255, 0.08);
}

.mockup_dots {
  display: flex;
  gap: 6px;
}

.mockup_dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;

  &--red {
    background: #AB052D;
  }
  &--yellow {
    background: #B08D57;
  }
  &--green {
    background: #1F3A5F;
  }
}

.mockup_address {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(11, 27, 43, 0.6);
  padding: 4px 14px;
  border-radius: 20px;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  color: rgba(255, 252, 255, 0.6);
}

.mockup_user {
  display: flex;
  align-items: center;
}

.mockup_avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #1F3A5F;
  color: #FFFCFF;
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mockup_body {
  display: grid;
  grid-template-columns: 140px 1fr;
  min-height: 380px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

.mockup_sidebar {
  background: #0B1B2B;
  border-right: 1px solid rgba(255, 252, 255, 0.06);
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (max-width: 640px) {
    display: none;
  }
}

.mockup_nav_item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: rgba(255, 252, 255, 0.6);

  &--active {
    background: rgba(31, 58, 95, 0.3);
    color: #B08D57;
    font-weight: 700;
  }
}

.mockup_content {
  padding: 20px;
  background: #1F2933;
}

.mockup_kpis {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 20px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

.kpi_card {
  background: #0B1B2B;
  border: 1px solid rgba(255, 252, 255, 0.08);
  border-radius: 10px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.kpi_label {
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  color: rgba(255, 252, 255, 0.5);
  margin-bottom: 6px;
  letter-spacing: 0.3px;
}

.kpi_val {
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  font-weight: 800;
  color: #FFFCFF;

  &--accent {
    color: #B08D57;
  }
}

.kpi_progress_wrap {
  height: 4px;
  background: rgba(255, 252, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 6px;
}

.kpi_progress_bar {
  height: 100%;
  background: #B08D57;
}

.kpi_sub {
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  color: rgba(255, 252, 255, 0.4);
  margin-top: 4px;
}

.mockup_table {
  background: rgba(11, 27, 43, 0.7);
  border-radius: 12px;
  border: 1px solid rgba(255, 252, 255, 0.08);
  overflow: hidden;
}

.table_row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  align-items: center;
  padding: 10px 14px;
  border-bottom: 1px solid rgba(255, 252, 255, 0.04);
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  color: rgba(255, 252, 255, 0.9);

  &:last-child {
    border-bottom: none;
  }

  &--header {
    background: rgba(11, 27, 43, 0.9);
    font-size: 10px;
    font-weight: 700;
    color: rgba(255, 252, 255, 0.45);
    letter-spacing: 0.5px;
  }
}

.doc_cell {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;

  span:last-child {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.doc_icon {
  font-size: 9px;
  font-weight: 800;
  background: rgba(171, 5, 45, 0.2);
  color: #AB052D;
  border: 1px solid rgba(171, 5, 45, 0.4);
  padding: 2px 4px;
  border-radius: 4px;
}

.text_muted {
  color: rgba(255, 252, 255, 0.5);
}

.badge {
  display: inline-block;
  font-size: 10px;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 10px;
  text-align: center;
  width: fit-content;

  &--success {
    background: rgba(47, 111, 109, 0.2);
    color: #2F6F6D;
    border: 1px solid rgba(47, 111, 109, 0.4);
  }

  &--info {
    background: rgba(31, 58, 95, 0.3);
    color: rgba(255, 252, 255, 0.85);
    border: 1px solid rgba(31, 58, 95, 0.6);
  }
}

/* Floating interactive badges */
.floating_badge {
  position: absolute;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 18px;
  background: #1F2933;
  border: 1px solid rgba(255, 252, 255, 0.15);
  border-radius: 14px;
  box-shadow: 0 16px 36px rgba(11, 27, 43, 0.7);
  backdrop-filter: blur(10px);
  animation: floatAnim 4s ease-in-out infinite alternate;

  strong {
    display: block;
    font-family: 'Inter', sans-serif;
    font-size: 12px;
    font-weight: 700;
    color: #FFFCFF;
  }

  small {
    font-family: 'Inter', sans-serif;
    font-size: 10px;
    color: rgba(255, 252, 255, 0.6);
  }

  &--left {
    bottom: -15px;
    left: -20px;
    border-color: rgba(176, 141, 87, 0.4);

    @media (max-width: 640px) {
      left: 10px;
      bottom: -10px;
    }
  }

  &--right {
    top: -15px;
    right: -20px;
    animation-delay: -2s;
    border-color: rgba(31, 58, 95, 0.8);

    @media (max-width: 640px) {
      right: 10px;
      top: -10px;
    }
  }
}

.badge_icon {
  font-size: 18px;
}

@keyframes floatAnim {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-8px);
  }
}
</style>
