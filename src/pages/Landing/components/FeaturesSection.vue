<script setup lang="ts">
const features = [
  {
    title: 'Armazenamento em Nuvem',
    category: 'Armazenamento',
    description: 'Envie e organize documentos em uma estrutura centralizada, com armazenamento em nuvem e controle de capacidade conforme o plano contratado.',
    benefit: 'Até 150 MB por arquivo',
    highlights: ['Upload rápido de arquivos', 'Limite de até 150 MB por arquivo', 'Organização por pastas', 'Histórico e backups diários']
  },
  {
    title: 'Estrutura Organizacional',
    category: 'Estrutura',
    description: 'Reproduza a organização da empresa dentro da plataforma.',
    benefit: 'Mapeamento fiel',
    highlights: ['Setores e funções', 'Funcionários e colaboradores', 'Clientes e contatos vinculados', 'Grupos e estruturas de acesso']
  },
  {
    title: 'Permissões de Acesso',
    category: 'Controle',
    description: 'Compartilhe um arquivo com toda uma equipe, determinado setor, grupo, cliente ou usuário específico.',
    benefit: 'Segurança granular',
    highlights: ['Controle individual de acesso', 'Permissões por estrutura', 'Administração de usuários', 'Controle de envio de arquivos']
  },
  {
    title: 'Portal do Cliente',
    category: 'Acesso Externo',
    description: 'Ofereça aos clientes uma forma organizada de acessar somente os documentos disponibilizados para eles.',
    benefit: 'Acessos ilimitados',
    highlights: ['Ambiente separado e exclusivo', 'Acessos ilimitados para clientes', 'Sem licenças adicionais por cliente', 'Controle e rastreabilidade']
  },
  {
    title: 'Confirmação de Leitura',
    category: 'Rastreabilidade',
    description: 'Acompanhe quando os documentos compartilhados são acessados pelos usuários autorizados.',
    benefit: 'Controle comprovado',
    highlights: ['Registro de data e hora do acesso', 'Identificação do usuário leitor', 'Rastreabilidade de compartilhamento', 'Histórico de visualizações']
  },
  {
    title: 'Auditoria e Relatórios',
    category: 'Governança',
    description: 'Nos planos que incluírem o recurso, acompanhe registros e relatórios relacionados à utilização da plataforma.',
    benefit: 'Visão operacional',
    highlights: ['Registros operacionais de atividade', 'Relatórios de utilização do sistema', 'Visão consolidada de arquivos', 'Rastreabilidade corporativa']
  }
]
</script>

<template>
  <section id="funcionalidades" class="features_section" aria-labelledby="features-title">
    <div class="features_container">
      <div class="section_header">
        <span class="section_badge">RECURSOS NATIVOS</span>
        <h2 id="features-title" class="section_title">
          Tudo o que sua empresa precisa para organizar e compartilhar arquivos
        </h2>
        <p class="section_subtitle">
          Construído para simplificar o armazenamento e compartilhamento de arquivos com uma interface intuitiva, segura e veloz.
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
