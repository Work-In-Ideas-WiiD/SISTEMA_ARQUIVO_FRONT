<script setup lang="ts">
// PlatformCompatibilitySection.vue
// Sessão de Compatibilidade com Navegadores e Roadmap de Integrações / Apps
</script>

<template>
  <section class="compatibility_section" aria-labelledby="compat-title">
    <div class="compatibility_container">
      <div class="compatibility_grid">
        <!-- Coluna da Esquerda: Em breve -->
        <div class="compat_card compat_card--roadmap">
          <div class="card_header">
            <span class="badge_roadmap">EM BREVE</span>
            <h2 id="compat-title" class="card_title">Ecossistema & Conectividade</h2>
            <p class="card_subtitle">Expansão contínua para integrar aos seus fluxos de trabalho e mobilidade total.</p>
          </div>

          <div class="roadmap_subgrid">
            <!-- Sub-coluna 1: APIs e Integrações -->
            <div class="roadmap_column">
              <h3 class="roadmap_heading">API’s e Integrações</h3>
              <div class="logos_grid">
                <!-- Microsoft 365 -->
                <div class="logo_item" title="Microsoft 365">
                  <div class="svg_wrap">
                    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <rect x="2" y="2" width="9" height="9" rx="1.5" fill="rgba(255,255,255,0.15)"/>
                      <rect x="13" y="2" width="9" height="9" rx="1.5" fill="rgba(255,255,255,0.15)"/>
                      <rect x="2" y="13" width="9" height="9" rx="1.5" fill="rgba(255,255,255,0.15)"/>
                      <rect x="13" y="13" width="9" height="9" rx="1.5" fill="rgba(255,255,255,0.15)"/>
                    </svg>
                  </div>
                  <span class="logo_label">Microsoft 365</span>
                </div>

                <!-- Google Docs -->
                <div class="logo_item" title="Google Docs">
                  <div class="svg_wrap">
                    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="rgba(255,255,255,0.1)"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <polyline points="10 9 9 9 8 9"/>
                    </svg>
                  </div>
                  <span class="logo_label">Google Docs</span>
                </div>

                <!-- Zapier -->
                <div class="logo_item" title="Zapier">
                  <div class="svg_wrap">
                    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <circle cx="12" cy="12" r="9" fill="rgba(255,255,255,0.1)"/>
                      <path d="M12 7v10"/>
                      <path d="M7 12h10"/>
                      <path d="M8.5 8.5l7 7"/>
                      <path d="M8.5 15.5l7-7"/>
                    </svg>
                  </div>
                  <span class="logo_label">Zapier</span>
                </div>

                <!-- Salesforce -->
                <div class="logo_item" title="Salesforce">
                  <div class="svg_wrap">
                    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <path d="M17.5 19H6.5a4.5 4.5 0 0 1-1.3-8.8 6 6 0 0 1 11.6-2.2A4.5 4.5 0 0 1 17.5 19z" fill="rgba(255,255,255,0.15)"/>
                    </svg>
                  </div>
                  <span class="logo_label">Salesforce</span>
                </div>
              </div>
            </div>

            <!-- Sub-coluna 2: Aplicativo para celular -->
            <div class="roadmap_column">
              <h3 class="roadmap_heading">Aplicativo para celular</h3>
              <div class="logos_grid">
                <!-- Android -->
                <div class="logo_item" title="Android">
                  <div class="svg_wrap">
                    <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <!-- Robô Android -->
                      <path d="M4 10v6a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-6" fill="rgba(255,255,255,0.1)"/>
                      <path d="M6 10a6 6 0 0 1 12 0"/>
                      <line x1="8" y1="4" x2="9.5" y2="6.5"/>
                      <line x1="16" y1="4" x2="14.5" y2="6.5"/>
                      <circle cx="9" cy="8.5" r="0.8" fill="white"/>
                      <circle cx="15" cy="8.5" r="0.8" fill="white"/>
                      <line x1="9" y1="17" x2="9" y2="20"/>
                      <line x1="15" y1="17" x2="15" y2="20"/>
                    </svg>
                  </div>
                  <span class="logo_label">Android</span>
                </div>

                <!-- iOS -->
                <div class="logo_item" title="iOS (Apple)">
                  <div class="svg_wrap">
                    <svg viewBox="0 0 24 24" width="32" height="32" fill="white" aria-hidden="true">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 0.92-2.87-.9.04-1.97.6-2.6 1.34-.55.63-1.03 1.68-.9 2.71 1.01.08 2.02-.49 2.58-1.18z"/>
                    </svg>
                  </div>
                  <span class="logo_label">iOS / Apple</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Coluna da Direita: Funciona em todos os navegadores -->
        <div class="compat_card compat_card--browsers">
          <div class="card_header">
            <span class="badge_active">100% WEB & NUVEM</span>
            <h2 class="card_title">Funciona em todos os navegadores</h2>
            <p class="card_subtitle highlight_row">No seu computador e no seu celular</p>
          </div>

          <p class="browsers_desc">
            Acesse seus arquivos instantaneamente de qualquer dispositivo, sem necessidade de download ou instalação de softwares pesados.
          </p>

          <div class="browsers_logos_wrap">
            <!-- Chrome -->
            <div class="browser_item" title="Google Chrome">
              <div class="browser_svg">
                <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="9"/>
                  <circle cx="12" cy="12" r="3.5" fill="rgba(255,255,255,0.2)"/>
                  <line x1="12" y1="8.5" x2="20.5" y2="8.5"/>
                  <line x1="8.97" y1="13.75" x2="4.72" y2="6.39"/>
                  <line x1="15.03" y1="13.75" x2="10.78" y2="21.11"/>
                </svg>
              </div>
              <span class="browser_name">Chrome</span>
            </div>

            <!-- Firefox -->
            <div class="browser_item" title="Mozilla Firefox">
              <div class="browser_svg">
                <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="9"/>
                  <path d="M12 3a9 9 0 0 1 8.5 6.1c-.8-.4-1.8-.6-2.5-.3-1.2.6-1.5 2-1.2 3.2.3 1.2 1.4 2 2.2 1.5.3 1.5-.5 3.2-2 4.1-1.8 1.1-4.2.7-5.5-.9-1.2-1.5-1-3.7.5-4.8.4-.3.9-.5 1.5-.6-1-.9-2.5-1.1-3.6-.5-1.5.8-2.2 2.6-1.8 4.2A9 9 0 0 1 12 3z"/>
                </svg>
              </div>
              <span class="browser_name">Firefox</span>
            </div>

            <!-- Edge -->
            <div class="browser_item" title="Microsoft Edge">
              <div class="browser_svg">
                <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M18.8 8.2c-.3-1.8-1.5-3.3-3.2-4-2.5-1-5.6-.2-7.1 2-1.4 2-1.3 4.8.2 6.7 1.5 1.9 4.1 2.7 6.4 2 1.5-.4 2.8-1.5 3.4-3"/>
                  <path d="M5.2 15.8c1.3 3.1 4.5 5.2 8 5.2 3.8 0 7-2.3 8.3-5.8-1.1.9-2.5 1.4-4 1.4-3.5 0-6.4-2.5-7-5.9"/>
                </svg>
              </div>
              <span class="browser_name">Edge</span>
            </div>

            <!-- Safari -->
            <div class="browser_item" title="Apple Safari">
              <div class="browser_svg">
                <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="9"/>
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="rgba(255,255,255,0.2)"/>
                </svg>
              </div>
              <span class="browser_name">Safari</span>
            </div>

            <!-- Opera -->
            <div class="browser_item" title="Opera">
              <div class="browser_svg">
                <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="9"/>
                  <ellipse cx="12" cy="12" rx="4.5" ry="6.5" fill="rgba(255,255,255,0.15)"/>
                </svg>
              </div>
              <span class="browser_name">Opera</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.compatibility_section {
  position: relative;
  padding: 80px 24px;
  background: #0B1B2B;
  border-top: 1px solid rgba(255, 252, 255, 0.08);
}

.compatibility_container {
  max-width: 1240px;
  margin: 0 auto;
}

.compatibility_grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    gap: 28px;
  }
}

.compat_card {
  position: relative;
  background: #1F2933;
  border: 1px solid rgba(255, 252, 255, 0.1);
  border-radius: 16px;
  padding: 36px 32px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 12px 30px rgba(11, 27, 43, 0.5);
  transition: transform 0.25s ease, border-color 0.25s ease;

  &:hover {
    border-color: rgba(176, 141, 87, 0.4);
    transform: translateY(-2px);
  }
}

.card_header {
  margin-bottom: 20px;
}

.badge_roadmap {
  display: inline-block;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #B08D57;
  background: rgba(176, 141, 87, 0.15);
  border: 1px solid rgba(176, 141, 87, 0.35);
  padding: 4px 12px;
  border-radius: 20px;
  margin-bottom: 12px;
}

.badge_active {
  display: inline-block;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #2F6F6D;
  background: rgba(47, 111, 109, 0.2);
  border: 1px solid rgba(47, 111, 109, 0.4);
  padding: 4px 12px;
  border-radius: 20px;
  margin-bottom: 12px;
}

.card_title {
  margin: 0 0 8px;
  font-family: 'Inter', sans-serif;
  font-size: clamp(22px, 2vw, 28px);
  font-weight: 700;
  color: #FFFCFF;
  line-height: 1.25;
}

.card_subtitle {
  margin: 0;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  color: rgba(255, 252, 255, 0.7);
  line-height: 1.5;

  &.highlight_row {
    color: #B08D57;
    font-weight: 600;
    font-size: 17px;
    margin-top: 4px;
  }
}

.browsers_desc {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: rgba(255, 252, 255, 0.75);
  line-height: 1.6;
  margin: 0 0 28px;
}

.roadmap_subgrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-top: 12px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

.roadmap_column {
  background: rgba(11, 27, 43, 0.6);
  border: 1px solid rgba(255, 252, 255, 0.08);
  border-radius: 12px;
  padding: 20px 16px;
}

.roadmap_heading {
  margin: 0 0 16px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 700;
  color: #FFFCFF;
  text-align: center;
  letter-spacing: 0.3px;
  border-bottom: 1px solid rgba(255, 252, 255, 0.08);
  padding-bottom: 10px;
}

.logos_grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.logo_item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 6px;
  border-radius: 8px;
  background: rgba(31, 58, 95, 0.25);
  border: 1px solid rgba(255, 252, 255, 0.06);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(31, 58, 95, 0.5);
    border-color: rgba(176, 141, 87, 0.3);
    transform: translateY(-2px);
  }
}

.svg_wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
}

.logo_label {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 252, 255, 0.9);
  text-align: center;
}

.browsers_logos_wrap {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-around;
  gap: 16px;
  padding: 24px 16px;
  background: rgba(11, 27, 43, 0.6);
  border: 1px solid rgba(255, 252, 255, 0.08);
  border-radius: 12px;
  margin-top: auto;
}

.browser_item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-3px);

    .browser_svg {
      border-color: #B08D57;
      background: rgba(176, 141, 87, 0.15);
    }
  }
}

.browser_svg {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(31, 58, 95, 0.35);
  border: 1px solid rgba(255, 252, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.browser_name {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #FFFCFF;
}
</style>
