<script setup lang="ts">
import { RouterLink } from 'vue-router'

const metrics = [
  {
    label: 'DISPONIBILIDADE SLA',
    value: '99,5%',
    description: 'Compromisso mensal de disponibilidade para os sistemas ativos em ambiente de produção.'
  },
  {
    label: 'RPO (OBJETIVO DE PONTO DE RECUPERAÇÃO)',
    value: 'Até 24h',
    description: 'Backups diários automatizados garantem que a perda máxima tolerável seja inferior a um ciclo diário.'
  },
  {
    label: 'RTO (OBJETIVO DE TEMPO DE RECUPERAÇÃO)',
    value: 'Até 8h úteis',
    description: 'Tempo objetivo para restabelecimento total da infraestrutura em incidentes graves de recuperação.'
  },
  {
    label: 'RETENÇÃO DE BACKUPS',
    value: '30 Dias',
    description: 'Cópias redundantes e distribuídas mantidas durante o ciclo operacional de 30 dias.'
  }
]

const portabilityItems = [
  {
    step: '01',
    title: 'Arquivos Excluídos & Lixeira',
    description: 'Arquivos deletados são enviados para a lixeira e permanecem recuperáveis por até 30 dias. Após o esvaziamento, deixam de estar nos sistemas ativos e seus resíduos são eliminados no ciclo dos backups.'
  },
  {
    step: '02',
    title: 'Janela de 90 Dias Pós-Encerramento',
    description: 'Após o término ou cancelamento da contratação, todos os arquivos e dados permanecem disponíveis exclusivamente para a empresa-cliente durante 90 dias para consulta e download completo.'
  },
  {
    step: '03',
    title: 'Exportação com Estrutura de Pastas',
    description: 'Sua empresa pode baixar os arquivos mantendo rigorosamente a hierarquia de pastas criada e exportar em planilhas todos os dados cadastrais de setores, funcionários, clientes e contatos.'
  },
  {
    step: '04',
    title: 'Exclusão Definitiva e Segura',
    description: 'Concluído o período de 90 dias, os dados são desprovisionados e removidos permanentemente dos sistemas ativos, com expiração residual dos backups conforme o ciclo regular.'
  }
]
</script>

<template>
  <section id="continuidade" class="continuity_section" aria-labelledby="continuity-title">
    <div class="continuity_container">
      <!-- Section Header -->
      <div class="section_header">
        <span class="section_badge">RESILIÊNCIA & GOVERNANÇA</span>
        <h2 id="continuity-title" class="section_title">
          Continuidade, proteção e previsibilidade para sua operação
        </h2>
        <p class="section_subtitle">
          Políticas transparentes de backup diário, contingência e compromisso formal de nível de serviço (SLA).
        </p>
      </div>

      <!-- SLA / Continuity Metrics Grid -->
      <div class="metrics_grid">
        <div v-for="(metric, mIdx) in metrics" :key="mIdx" class="metric_card">
          <span class="metric_label">{{ metric.label }}</span>
          <span class="metric_val">{{ metric.value }}</span>
          <p class="metric_desc">{{ metric.description }}</p>
        </div>
      </div>

      <!-- SLA Consult Action Bar -->
      <div class="sla_action_bar">
        <div class="sla_action_text">
          <strong>Quer conhecer todos os critérios, exclusões e compensações do nosso SLA?</strong>
          <span>O SLA oficial do AkiDocs detalha prazos de primeira resposta por severidade de chamado e cálculo de disponibilidade.</span>
        </div>
        <RouterLink to="/sla" class="sla_cta_btn">
          <span>CONSULTAR SLA</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </RouterLink>
      </div>

      <!-- Portability & Data Ownership Box -->
      <div class="portability_box">
        <div class="portability_header">
          <span class="portability_tag">PORTABILIDADE & ENCERRAMENTO</span>
          <h3 class="portability_title">Seus dados continuam sendo seus</h3>
          <p class="portability_sub">
            Você tem total liberdade para entrar ou sair da plataforma. Não aplicamos qualquer tipo de aprisionamento de dados (lock-in) à sua operação.
          </p>
        </div>

        <div class="portability_grid">
          <div v-for="(pItem, pIdx) in portabilityItems" :key="pIdx" class="portability_card">
            <span class="portability_step">{{ pItem.step }}</span>
            <h4 class="portability_item_title">{{ pItem.title }}</h4>
            <p class="portability_item_desc">{{ pItem.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.continuity_section {
  position: relative;
  padding: 100px 24px;
  background: #212121;
  border-top: 1px solid rgba(247, 247, 247, 0.05);
}

.continuity_container {
  max-width: 1240px;
  margin: 0 auto;
}

.section_header {
  text-align: center;
  max-width: 760px;
  margin: 0 auto 64px;
}

.section_badge {
  display: inline-block;
  font-family: 'Source Code Pro', monospace;
  font-size: 11px;
  font-weight: 700;
  color: #ff00ff;
  letter-spacing: 1px;
  padding: 6px 14px;
  background: rgba(255, 0, 255, 0.1);
  border: 1px solid rgba(255, 0, 255, 0.25);
  border-radius: 20px;
  margin-bottom: 16px;
}

.section_title {
  margin: 0 0 16px;
  font-family: 'Source Code Pro', monospace;
  font-size: clamp(26px, 2.5vw, 36px);
  font-weight: 700;
  color: #f7f7f7;
  line-height: 1.25;
}

.section_subtitle {
  margin: 0;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.6;
  color: rgba(247, 247, 247, 0.7);
}

/* Metrics Grid */
.metrics_grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 32px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
}

.metric_card {
  background: rgba(121, 121, 121, 0.12);
  border: 1px solid rgba(247, 247, 247, 0.08);
  border-radius: 20px;
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  transition: all 0.25s ease;

  &:hover {
    border-color: rgba(255, 0, 255, 0.35);
    background: rgba(121, 121, 121, 0.18);
    transform: translateY(-2px);
  }
}

.metric_label {
  font-family: 'Source Code Pro', monospace;
  font-size: 10px;
  font-weight: 700;
  color: #ff00ff;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

.metric_val {
  font-family: 'Source Code Pro', monospace;
  font-size: 32px;
  font-weight: 800;
  color: #f7f7f7;
  line-height: 1.1;
  margin-bottom: 12px;
}

.metric_desc {
  margin: 0;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  line-height: 1.55;
  color: rgba(247, 247, 247, 0.65);
}

/* SLA Action Bar */
.sla_action_bar {
  background: rgba(33, 33, 33, 0.8);
  border: 1px solid rgba(247, 247, 247, 0.1);
  border-radius: 20px;
  padding: 22px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 56px;
}

.sla_action_text {
  display: flex;
  flex-direction: column;
  gap: 4px;

  strong {
    font-family: 'Source Code Pro', monospace;
    font-size: 15px;
    font-weight: 700;
    color: #f7f7f7;
  }

  span {
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    color: rgba(247, 247, 247, 0.65);
  }
}

.sla_cta_btn {
  font-family: 'Source Code Pro', monospace;
  font-size: 13px;
  font-weight: 800;
  color: #f7f7f7;
  background: rgba(255, 0, 255, 0.15);
  border: 1px solid rgba(255, 0, 255, 0.35);
  border-radius: 30px;
  padding: 12px 24px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
  white-space: nowrap;

  &:hover {
    background: #ff00ff;
    color: #ffffff;
    box-shadow: 0 0 20px rgba(255, 0, 255, 0.4);
    transform: translateY(-2px);
  }
}

/* Portability Box */
.portability_box {
  background: rgba(33, 33, 33, 0.6);
  border: 1px solid rgba(247, 247, 247, 0.08);
  border-radius: 28px;
  padding: 44px 36px;

  @media (max-width: 768px) {
    padding: 32px 20px;
  }
}

.portability_header {
  text-align: center;
  max-width: 720px;
  margin: 0 auto 40px;
}

.portability_tag {
  display: inline-block;
  font-family: 'Source Code Pro', monospace;
  font-size: 10px;
  font-weight: 700;
  color: #ff00ff;
  letter-spacing: 0.8px;
  margin-bottom: 8px;
}

.portability_title {
  margin: 0 0 12px;
  font-family: 'Source Code Pro', monospace;
  font-size: clamp(22px, 2.2vw, 28px);
  font-weight: 800;
  color: #f7f7f7;
}

.portability_sub {
  margin: 0;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  line-height: 1.6;
  color: rgba(247, 247, 247, 0.7);
}

.portability_grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
}

.portability_card {
  background: rgba(121, 121, 121, 0.1);
  border: 1px solid rgba(247, 247, 247, 0.06);
  border-radius: 20px;
  padding: 26px 22px;
  display: flex;
  flex-direction: column;
}

.portability_step {
  font-family: 'Source Code Pro', monospace;
  font-size: 24px;
  font-weight: 800;
  color: #ff00ff;
  line-height: 1;
  margin-bottom: 14px;
}

.portability_item_title {
  margin: 0 0 10px;
  font-family: 'Source Code Pro', monospace;
  font-size: 15px;
  font-weight: 700;
  color: #f7f7f7;
  line-height: 1.3;
}

.portability_item_desc {
  margin: 0;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.6;
  color: rgba(247, 247, 247, 0.65);
}
</style>
