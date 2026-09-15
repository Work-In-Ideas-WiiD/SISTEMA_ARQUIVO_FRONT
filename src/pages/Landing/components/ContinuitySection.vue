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
  background: #0B1B2B;
  border-top: 1px solid rgba(255, 252, 255, 0.08);
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
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 700;
  color: #B08D57;
  letter-spacing: 1px;
  padding: 6px 14px;
  background: rgba(176, 141, 87, 0.15);
  border: 1px solid rgba(176, 141, 87, 0.35);
  border-radius: 20px;
  margin-bottom: 16px;
}

.section_title {
  margin: 0 0 16px;
  font-family: 'Inter', sans-serif;
  font-size: clamp(26px, 2.5vw, 36px);
  font-weight: 700;
  color: #FFFCFF;
  line-height: 1.25;
}

.section_subtitle {
  margin: 0;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.6;
  color: rgba(255, 252, 255, 0.7);
}

.metrics_grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 48px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
}

.metric_card {
  background: #1F2933;
  border: 1px solid rgba(255, 252, 255, 0.08);
  border-radius: 20px;
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 30px rgba(11, 27, 43, 0.4);
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-3px);
    border-color: rgba(176, 141, 87, 0.45);
    background: rgba(31, 58, 95, 0.25);
  }
}

.metric_label {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 700;
  color: rgba(255, 252, 255, 0.6);
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

.metric_val {
  font-family: 'Inter', sans-serif;
  font-size: 36px;
  font-weight: 800;
  color: #B08D57;
  line-height: 1.1;
  margin-bottom: 12px;
}

.metric_desc {
  margin: 0;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.55;
  color: rgba(255, 252, 255, 0.75);
}

.sla_action_bar {
  background: #1F2933;
  border: 1px solid rgba(255, 252, 255, 0.1);
  border-radius: 20px;
  padding: 24px 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 64px;
  box-shadow: 0 10px 30px rgba(11, 27, 43, 0.5);

  @media (max-width: 800px) {
    flex-direction: column;
    align-items: flex-start;
  }
}

.sla_action_text {
  display: flex;
  flex-direction: column;
  gap: 6px;

  strong {
    font-family: 'Inter', sans-serif;
    font-size: 16px;
    font-weight: 700;
    color: #FFFCFF;
  }

  span {
    font-family: 'Inter', sans-serif;
    font-size: 13.5px;
    color: rgba(255, 252, 255, 0.7);
    line-height: 1.5;
  }
}

.sla_cta_btn {
  background: #B08D57;
  color: #FFFFFF;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.5px;
  padding: 12px 24px;
  border-radius: 30px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: #FFFCFF;
    color: #0B1B2B;
    box-shadow: 0 0 16px rgba(176, 141, 87, 0.5);
    transform: translateY(-2px);
  }
}

.portability_box {
  background: #1F2933;
  border: 1px solid rgba(255, 252, 255, 0.08);
  border-radius: 24px;
  padding: 40px 36px;
  box-shadow: 0 12px 36px rgba(11, 27, 43, 0.5);
}

.portability_header {
  margin-bottom: 32px;
}

.portability_tag {
  display: inline-block;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 700;
  color: #B08D57;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.portability_title {
  margin: 0 0 8px;
  font-family: 'Inter', sans-serif;
  font-size: 24px;
  font-weight: 700;
  color: #FFFCFF;
}

.portability_sub {
  margin: 0;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: rgba(255, 252, 255, 0.7);
  line-height: 1.55;
  max-width: 680px;
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
  background: rgba(11, 27, 43, 0.6);
  border: 1px solid rgba(255, 252, 255, 0.08);
  border-radius: 16px;
  padding: 24px 20px;
}

.portability_step {
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  font-weight: 800;
  color: #B08D57;
  display: inline-block;
  background: rgba(176, 141, 87, 0.15);
  border: 1px solid rgba(176, 141, 87, 0.3);
  padding: 4px 10px;
  border-radius: 12px;
  margin-bottom: 14px;
}

.portability_item_title {
  margin: 0 0 8px;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 700;
  color: #FFFCFF;
}

.portability_item_desc {
  margin: 0;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  line-height: 1.55;
  color: rgba(255, 252, 255, 0.7);
}
</style>
