<script setup lang="ts">
const features = [
  {
    title: 'Gestão Inteligente de Contratos',
    category: 'Documentos',
    description: 'Centralize contratos em PDF com identificação rápida, upload simplificado, vínculo por empresa e histórico completo de arquivos.',
    benefit: 'Reduz o tempo de busca de minutas em até 80%',
    highlights: ['Upload rápido de PDFs', 'Vínculo direto com empresas', 'Histórico e downloads rastreados']
  },
  {
    title: 'Estrutura Organizacional Completa',
    category: 'Gestão',
    description: 'Modele a realidade da sua empresa com divisões por setores, funções, colaboradores e agrupamentos estratégicos de trabalho.',
    benefit: 'Alinhamento imediato entre equipes e pastas',
    highlights: ['Setores personalizados', 'Cargos e funções mapeados', 'Agrupamentos de funcionários']
  },
  {
    title: 'Portal Exclusivo do Cliente',
    category: 'Acesso Externo',
    description: 'Ofereça aos seus clientes um canal profissional e seguro para visualizar e baixar seus contratos com login dedicado.',
    benefit: 'Transparência e credibilidade institucional',
    highlights: ['Área de cliente com login próprio', 'Isolamento de documentos', 'Visualização descomplicada']
  },
  {
    title: 'Módulo de Assinaturas Eletrônicas',
    category: 'Compliance',
    description: 'Acompanhe o ciclo de validação jurídica e assinaturas digitais com status em tempo real de quem já assinou ou está pendente.',
    benefit: 'Fechamento de acordos até 5x mais rápido',
    highlights: ['Controle de status em tempo real', 'Fluxo integrado com o sistema', 'Segurança jurídica para as partes']
  },
  {
    title: 'Armazenamento em Nuvem Dedicado',
    category: 'Infraestrutura',
    description: 'Armazene gigabytes de dados com controle transparente de cota, backups contínuos e alta disponibilidade de infraestrutura.',
    benefit: 'Zero risco de perda de arquivos físicos',
    highlights: ['Cotas de armazenamento em GB', 'Transferência criptografada', 'Disponibilidade 24/7']
  },
  {
    title: 'Segurança & Controle Granular',
    category: 'Auditoria',
    description: 'Permissões por papel (Administradores, Colaboradores e Clientes) assegurando que cada arquivo seja acessado apenas por quem tem autorização.',
    benefit: 'Proteção irrestrita contra vazamentos de dados',
    highlights: ['Controle estrito de permissões', 'Tokens de acesso seguros', 'Auditoria de integridade']
  }
]
</script>

<template>
  <section id="funcionalidades" class="features_section" aria-labelledby="features-title">
    <div class="features_container">
      <div class="section_header">
        <span class="section_badge">RECURSOS NATIVOS</span>
        <h2 id="features-title" class="section_title">
          Tudo o que sua empresa precisa para gerenciar documentos
        </h2>
        <p class="section_subtitle">
          Construído para simplificar processos complexos com uma interface intuitiva, segura e veloz.
        </p>
      </div>

      <div class="features_grid">
        <article v-for="(feat, idx) in features" :key="idx" class="feature_card">
          <div class="feature_top">
            <span class="feature_cat">{{ feat.category }}</span>
            <span class="feature_benefit_badge">{{ feat.benefit }}</span>
          </div>

          <h3 class="feature_name">{{ feat.title }}</h3>
          <p class="feature_desc">{{ feat.description }}</p>

          <ul class="feature_highlights">
            <li v-for="(hl, hIdx) in feat.highlights" :key="hIdx">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff00ff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>{{ hl }}</span>
            </li>
          </ul>
        </article>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.features_section {
  position: relative;
  padding: 100px 24px;
  background: #252525;
}

.features_container {
  max-width: 1240px;
  margin: 0 auto;
}

.section_header {
  text-align: center;
  max-width: 720px;
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

.features_grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 680px) {
    grid-template-columns: 1fr;
  }
}

.feature_card {
  background: rgba(33, 33, 33, 0.7);
  border: 1px solid rgba(247, 247, 247, 0.08);
  border-radius: 24px;
  padding: 32px 28px;
  display: flex;
  flex-direction: column;
  transition: all 0.25s ease;

  &:hover {
    border-color: rgba(255, 0, 255, 0.35);
    background: rgba(33, 33, 33, 0.95);
    transform: translateY(-4px);
    box-shadow: 0 16px 36px rgba(0, 0, 0, 0.5);
  }
}

.feature_top {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.feature_cat {
  font-family: 'Source Code Pro', monospace;
  font-size: 11px;
  font-weight: 700;
  color: #ff00ff;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.feature_benefit_badge {
  display: inline-block;
  font-family: 'Source Code Pro', monospace;
  font-size: 11px;
  font-weight: 600;
  color: rgba(247, 247, 247, 0.85);
  background: rgba(121, 121, 121, 0.2);
  padding: 4px 10px;
  border-radius: 8px;
  width: fit-content;
}

.feature_name {
  margin: 0 0 12px;
  font-family: 'Source Code Pro', monospace;
  font-size: 19px;
  font-weight: 700;
  color: #f7f7f7;
  line-height: 1.3;
}

.feature_desc {
  margin: 0 0 20px;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.6;
  color: rgba(247, 247, 247, 0.65);
  flex-grow: 1;
}

.feature_highlights {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  border-top: 1px solid rgba(247, 247, 247, 0.08);
  padding-top: 18px;

  li {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    color: rgba(247, 247, 247, 0.8);
  }
}
</style>
