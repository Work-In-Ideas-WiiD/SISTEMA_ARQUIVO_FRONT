<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { trackContactClick } from '@/utils/tracking'

function onWhatsAppClick() {
  trackContactClick('whatsapp', 'about_section', '5562983398612')
}

function onEmailClick() {
  trackContactClick('email', 'about_section', 'contato@wi-id.com')
}
</script>

<template>
  <section id="sobre" class="about_section" aria-labelledby="about-title">
    <div class="about_container">
      <div class="about_grid">
        <!-- Text Column -->
        <div class="about_content">
          <span class="about_badge">QUEM DESENVOLVE</span>
          <h2 id="about-title" class="about_title">
            Desenvolvido pela Work in Ideas
          </h2>
          <p class="about_text">
            O <strong>AkiDocs</strong> é uma solução desenvolvida pela <strong>Work in Ideas</strong>, empresa com mais de 12 anos de experiência em desenvolvimento de software corporativo sob demanda, com atuação em todo o Brasil e sede própria em Goiânia-GO.
          </p>
          <p class="about_subtext">
            Combinamos arquitetura de alta confiabilidade, rigor técnico em privacidade e segurança com uma experiência de uso descomplicada para que sua empresa ganhe produtividade real desde o primeiro dia.
          </p>

          <div class="about_links">
            <RouterLink to="/sobre" class="about_learn_more">
              <span>Conheça a história e os pilares da Work in Ideas</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </RouterLink>
          </div>
        </div>

        <!-- Institutional Data Card -->
        <div class="about_card">
          <div class="card_header">
            <span class="card_company">WORK IN IDEAS TECNOLOGIA</span>
            <span class="card_status">12+ ANOS NO MERCADO</span>
          </div>

          <div class="card_body">
            <div class="info_row">
              <span class="info_label">Razão Social & CNPJ</span>
              <strong class="info_val">Work in Ideas Ltda.</strong>
              <span class="info_sub">CNPJ: 17.808.481/0001-69</span>
            </div>

            <div class="info_row">
              <span class="info_label">Sede Corporativa</span>
              <strong class="info_val">Av. T-1, 2266 — Setor Bueno</strong>
              <span class="info_sub">Goiânia — GO, CEP 74215-025</span>
            </div>

            <div class="info_row">
              <span class="info_label">Canais Oficiais</span>
              <div class="contact_links">
                <a
                  href="https://wa.me/5562983398612"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="contact_chip contact_chip--wa"
                  @click="onWhatsAppClick"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                  <span>(62) 98339-8612</span>
                </a>
                <a href="mailto:contato@wi-id.com" class="contact_chip" @click="onEmailClick">
                  <span>contato@wi-id.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.about_section {
  position: relative;
  padding: 100px 24px;
  background: #0B1B2B;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.about_container {
  max-width: 1240px;
  margin: 0 auto;
}

.about_grid {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 56px;
  align-items: center;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
}

.about_badge {
  display: inline-block;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 700;
  color: #B08D57;
  letter-spacing: 1px;
  padding: 6px 14px;
  background: rgba(176, 141, 87, 0.12);
  border: 1px solid rgba(176, 141, 87, 0.3);
  border-radius: 20px;
  margin-bottom: 16px;
}

.about_title {
  margin: 0 0 20px;
  font-family: 'Inter', sans-serif;
  font-size: clamp(26px, 2.5vw, 36px);
  font-weight: 800;
  color: #FFFCFF;
  line-height: 1.25;
}

.about_text {
  margin: 0 0 16px;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.65;
  color: rgba(255, 252, 255, 0.85);

  strong {
    color: #FFFCFF;
  }
}

.about_subtext {
  margin: 0 0 28px;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.65;
  color: rgba(255, 252, 255, 0.7);
}

.about_learn_more {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #B08D57;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    color: #C29F68;
    transform: translateX(4px);
  }
}

/* Institutional Card */
.about_card {
  background: var(--night-surface, #132438);
  border: 1px solid var(--night-surface-border, rgba(176, 141, 87, 0.18));
  border-radius: 24px;
  padding: 36px 32px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);
}

.card_header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  margin-bottom: 24px;
}

.card_company {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 700;
  color: #B08D57;
  letter-spacing: 0.8px;
}

.card_status {
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 700;
  color: rgba(255, 252, 255, 0.7);
  background: rgba(255, 255, 255, 0.08);
  padding: 3px 8px;
  border-radius: 6px;
}

.card_body {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.info_row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info_label {
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 600;
  color: rgba(255, 252, 255, 0.5);
  text-transform: uppercase;
}

.info_val {
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 600;
  color: #FFFCFF;
}

.info_sub {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: rgba(255, 252, 255, 0.6);
}

.contact_links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 6px;
}

.contact_chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  padding: 6px 12px;
  border-radius: 20px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: #FFFCFF;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    border-color: #B08D57;
    color: #B08D57;
  }

  &--wa:hover {
    border-color: #25D366;
    color: #25D366;
  }
}
</style>
