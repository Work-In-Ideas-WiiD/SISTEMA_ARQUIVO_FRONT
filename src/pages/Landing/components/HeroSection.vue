<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { trackEvent } from '@/utils/tracking'

function onStartClick() {
  trackEvent('clique_comecar_agora', { local: 'hero' })
}

function scrollToPricing() {
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
          Gestão Inteligente de Documentos, Contratos e Clientes na Nuvem
        </h1>

        <p class="hero_description">
          Centralize seus arquivos, acelere assinaturas eletrônicas e organize empresas,
          setores e clientes em um único ecossistema seguro, escalável e 100% em conformidade com a LGPD.
        </p>

        <div class="hero_actions">
          <RouterLink to="/cadastro" class="hero_btn hero_btn--primary" @click="onStartClick">
            <span>COMEÇAR AGORA</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </RouterLink>

          <button type="button" class="hero_btn hero_btn--secondary" @click="scrollToPricing">
            VER PLANOS E PREÇOS
          </button>
        </div>

        <div class="hero_trust">
          <div class="trust_item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff00ff" stroke-width="2" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span>Criptografia de Ponta a Ponta</span>
          </div>
          <div class="trust_item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff00ff" stroke-width="2" aria-hidden="true">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            <span>Sem Taxa de Instalação</span>
          </div>
          <div class="trust_item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff00ff" stroke-width="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 14 14"/>
            </svg>
            <span>Pronto em 2 Minutos</span>
          </div>
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
              <span>app.wiidocs.com.br/dashboard</span>
            </div>
            <div class="mockup_user">
              <span class="mockup_avatar">AL</span>
            </div>
          </div>

          <!-- Window Body -->
          <div class="mockup_body">
            <!-- Mockup Sidebar -->
            <div class="mockup_sidebar">
              <div class="mockup_nav_item mockup_nav_item--active">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                </svg>
                <span>Contratos</span>
              </div>
              <div class="mockup_nav_item">
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
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                </svg>
                <span>Setores</span>
              </div>
            </div>

            <!-- Mockup Main -->
            <div class="mockup_main">
              <!-- KPI Cards -->
              <div class="mockup_kpis">
                <div class="kpi_card">
                  <span class="kpi_label">Contratos Ativos</span>
                  <span class="kpi_val">1.420</span>
                </div>
                <div class="kpi_card">
                  <span class="kpi_label">Armazenamento</span>
                  <div class="kpi_progress_wrap">
                    <div class="kpi_progress_bar" style="width: 25%"></div>
                  </div>
                  <span class="kpi_sub">24.8 GB de 100 GB</span>
                </div>
                <div class="kpi_card">
                  <span class="kpi_label">Assinaturas</span>
                  <span class="kpi_val kpi_val--accent">98.4%</span>
                </div>
              </div>

              <!-- Document List Preview -->
              <div class="mockup_table">
                <div class="table_row table_row--header">
                  <span>Documento</span>
                  <span>Setor</span>
                  <span>Status</span>
                </div>
                <div class="table_row">
                  <div class="doc_cell">
                    <span class="doc_icon">PDF</span>
                    <span>Contrato_Prestacao_2026.pdf</span>
                  </div>
                  <span class="text_muted">Jurídico</span>
                  <span class="badge badge--success">Assinado</span>
                </div>
                <div class="table_row">
                  <div class="doc_cell">
                    <span class="doc_icon">PDF</span>
                    <span>Auditoria_Fiscal_Q1.pdf</span>
                  </div>
                  <span class="text_muted">Financeiro</span>
                  <span class="badge badge--warning">Em Análise</span>
                </div>
                <div class="table_row">
                  <div class="doc_cell">
                    <span class="doc_icon">PDF</span>
                    <span>Termo_Confidencialidade.pdf</span>
                  </div>
                  <span class="text_muted">Diretoria</span>
                  <span class="badge badge--success">Assinado</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Floating Interactive Badges -->
        <div class="floating_badge floating_badge--left">
          <span class="badge_icon">🔒</span>
          <div>
            <strong>Criptografia 256-bit</strong>
            <small>Arquivos protegidos</small>
          </div>
        </div>

        <div class="floating_badge floating_badge--right">
          <span class="badge_icon">⚡</span>
          <div>
            <strong>Indexação Imediata</strong>
            <small>Busca em &lt; 50ms</small>
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
  background: radial-gradient(circle at 80% 20%, rgba(255, 0, 255, 0.12) 0%, rgba(33, 33, 33, 1) 70%),
              #212121;
  overflow: hidden;
}

.hero_watermark {
  position: absolute;
  z-index: 0;
  top: 45%;
  right: -5vw;
  transform: translateY(-50%);
  font-family: 'Source Code Pro', monospace;
  font-size: clamp(140px, 24vw, 320px);
  font-weight: 800;
  line-height: 0.8;
  color: #f7f7f7;
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

  &--magenta {
    top: 10%;
    right: 15%;
    width: 450px;
    height: 450px;
    background: rgba(255, 0, 255, 0.18);
  }

  &--subtle {
    bottom: 5%;
    left: 5%;
    width: 380px;
    height: 380px;
    background: rgba(255, 255, 255, 0.03);
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
  background: rgba(255, 0, 255, 0.12);
  border: 1px solid rgba(255, 0, 255, 0.35);
  color: #ff00ff;
  font-family: 'Source Code Pro', monospace;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.8px;
  margin-bottom: 24px;
}

.hero_tag__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ff00ff;
  box-shadow: 0 0 10px #ff00ff;
}

.hero_title {
  margin: 0 0 20px;
  font-family: 'Source Code Pro', monospace;
  font-size: clamp(32px, 3.4vw, 50px);
  font-weight: 800;
  line-height: 1.15;
  color: #f7f7f7;
  letter-spacing: -0.5px;
}

.hero_description {
  margin: 0 0 36px;
  font-family: 'Inter', sans-serif;
  font-size: clamp(16px, 1.2vw, 18px);
  font-weight: 400;
  line-height: 1.6;
  color: rgba(247, 247, 247, 0.78);
  max-width: 540px;
}

.hero_actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 40px;
}

.hero_btn {
  font-family: 'Source Code Pro', monospace;
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
    background: #f7f7f7;
    color: #212121;
    border: none;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);

    &:hover {
      background: #ffffff;
      box-shadow: 0 0 25px rgba(255, 0, 255, 0.5);
      transform: translateY(-2px);
    }
  }

  &--secondary {
    background: rgba(121, 121, 121, 0.2);
    color: #f7f7f7;
    border: 1px solid rgba(247, 247, 247, 0.25);
    backdrop-filter: blur(10px);

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: #ff00ff;
      color: #ff00ff;
      transform: translateY(-2px);
    }
  }
}

.hero_trust {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;

  @media (max-width: 1024px) {
    justify-content: center;
  }
}

.trust_item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 500;
  color: rgba(247, 247, 247, 0.7);
}

/* Visual UI Showcase Mockup */
.hero_visual {
  position: relative;
  width: 100%;
}

.mockup_window {
  width: 100%;
  background: #252525;
  border: 1px solid rgba(247, 247, 247, 0.15);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.65), 0 0 40px rgba(255, 0, 255, 0.1);
}

.mockup_header {
  height: 44px;
  background: #1e1e1e;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-bottom: 1px solid rgba(247, 247, 247, 0.08);
}

.mockup_dots {
  display: flex;
  gap: 6px;
}

.mockup_dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;

  &--red { background: #ff5f56; }
  &--yellow { background: #ffbd2e; }
  &--green { background: #27c93f; }
}

.mockup_address {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(0, 0, 0, 0.4);
  padding: 4px 14px;
  border-radius: 20px;
  font-family: 'Source Code Pro', monospace;
  font-size: 11px;
  color: rgba(247, 247, 247, 0.6);
}

.mockup_user {
  display: flex;
  align-items: center;
}

.mockup_avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #ff00ff;
  color: #fff;
  font-family: 'Source Code Pro', monospace;
  font-size: 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mockup_body {
  display: grid;
  grid-template-columns: 140px 1fr;
  min-height: 320px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
}

.mockup_sidebar {
  background: #212121;
  border-right: 1px solid rgba(247, 247, 247, 0.06);
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (max-width: 600px) {
    display: none;
  }
}

.mockup_nav_item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 8px;
  font-family: 'Source Code Pro', monospace;
  font-size: 12px;
  color: rgba(247, 247, 247, 0.6);

  &--active {
    background: rgba(255, 0, 255, 0.15);
    color: #ff00ff;
    font-weight: 700;
  }
}

.mockup_main {
  padding: 20px;
  background: #252525;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.mockup_kpis {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

.kpi_card {
  background: rgba(121, 121, 121, 0.2);
  border-radius: 12px;
  padding: 12px 14px;
  border: 1px solid rgba(247, 247, 247, 0.08);
}

.kpi_label {
  display: block;
  font-family: 'Source Code Pro', monospace;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  color: rgba(247, 247, 247, 0.6);
  margin-bottom: 6px;
}

.kpi_val {
  font-family: 'Source Code Pro', monospace;
  font-size: 18px;
  font-weight: 700;
  color: #f7f7f7;

  &--accent {
    color: #ff00ff;
  }
}

.kpi_progress_wrap {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  margin: 4px 0 6px;
  overflow: hidden;
}

.kpi_progress_bar {
  height: 100%;
  background: #ff00ff;
  border-radius: 4px;
}

.kpi_sub {
  font-family: 'Source Code Pro', monospace;
  font-size: 9px;
  color: rgba(247, 247, 247, 0.5);
}

.mockup_table {
  background: rgba(121, 121, 121, 0.15);
  border-radius: 12px;
  border: 1px solid rgba(247, 247, 247, 0.08);
  overflow: hidden;
}

.table_row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  padding: 10px 14px;
  align-items: center;
  font-family: 'Source Code Pro', monospace;
  font-size: 11px;
  border-bottom: 1px solid rgba(247, 247, 247, 0.05);

  &--header {
    background: rgba(0, 0, 0, 0.2);
    font-weight: 700;
    color: rgba(247, 247, 247, 0.5);
    text-transform: uppercase;
    font-size: 9px;
  }

  &:last-child {
    border-bottom: none;
  }
}

.doc_cell {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #f7f7f7;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.doc_icon {
  font-size: 9px;
  font-weight: 700;
  background: rgba(255, 0, 255, 0.2);
  color: #ff00ff;
  padding: 2px 4px;
  border-radius: 4px;
}

.text_muted {
  color: rgba(247, 247, 247, 0.6);
}

.badge {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 9px;
  font-weight: 700;
  text-align: center;
  width: fit-content;

  &--success {
    background: rgba(39, 201, 63, 0.15);
    color: #27c93f;
    border: 1px solid rgba(39, 201, 63, 0.3);
  }

  &--warning {
    background: rgba(255, 189, 46, 0.15);
    color: #ffbd2e;
    border: 1px solid rgba(255, 189, 46, 0.3);
  }
}

/* Floating Badges */
.floating_badge {
  position: absolute;
  z-index: 3;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 18px;
  background: rgba(33, 33, 33, 0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 0, 255, 0.4);
  border-radius: 16px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.6);
  font-family: 'Source Code Pro', monospace;
  animation: float 4s ease-in-out infinite alternate;

  strong {
    display: block;
    font-size: 12px;
    color: #f7f7f7;
  }

  small {
    font-size: 10px;
    color: rgba(247, 247, 247, 0.6);
  }

  &--left {
    bottom: -15px;
    left: -20px;
    animation-delay: 0.5s;

    @media (max-width: 768px) {
      display: none;
    }
  }

  &--right {
    top: -15px;
    right: -20px;

    @media (max-width: 768px) {
      display: none;
    }
  }
}

.badge_icon {
  font-size: 20px;
}

@keyframes float {
  0% { transform: translateY(0px); }
  100% { transform: translateY(-8px); }
}
</style>
