<script setup lang="ts">
const differentials = [
  {
    tag: 'ACESSO EXTERNO',
    title: 'Clientes sem licenças adicionais',
    description: 'Compartilhe documentos com seus clientes sem exigir a contratação de usuários adicionais para cada acesso.'
  },
  {
    tag: 'ESTRUTURA DEDICADA',
    title: 'Organização empresarial',
    description: 'Estruture documentos com base nos setores, funções, equipes e clientes da sua empresa.'
  },
  {
    tag: 'RASTREAMENTO',
    title: 'Controle e rastreabilidade',
    description: 'Determine quem pode acessar cada informação e acompanhe os acessos realizados e confirmações de leitura.'
  },
  {
    tag: 'OPERAÇÃO EM NUVEM',
    title: 'Implantação simples',
    description: 'Crie a conta e comece a operar pelo navegador imediatamente, sem instalar servidores ou softwares.'
  }
]
</script>

<template>
  <section id="diferenciais" class="differentials_section" aria-labelledby="diff-title">
    <div class="diff_container">
      <div class="section_header">
        <span class="section_badge">DIFERENCIAIS EXCLUSIVOS</span>
        <h2 id="diff-title" class="section_title">
          Mais do que um drive compartilhado
        </h2>
        <p class="section_subtitle">
          Se você já utiliza Google Drive, Dropbox ou ferramentas similares, sabe que armazenar arquivos é apenas uma parte do problema. O desafio aparece quando é necessário organizar documentos por empresa, setor, função, cliente e usuário, além de controlar quem pode acessar cada informação.
        </p>
        <p class="section_highlight">
          O AkiDocs combina armazenamento em nuvem com uma estrutura organizacional voltada ao ambiente empresarial.
        </p>
      </div>

      <div class="diff_grid">
        <div v-for="(diff, idx) in differentials" :key="idx" class="diff_card">
          <div class="diff_glow" aria-hidden="true"></div>
          <span class="diff_tag">{{ diff.tag }}</span>
          <h3 class="diff_card_title">{{ diff.title }}</h3>
          <p class="diff_card_text">{{ diff.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.differentials_section {
  position: relative;
  padding: 100px 24px;
  background: #0B1B2B;
  border-top: 1px solid rgba(255, 252, 255, 0.08);
}

.diff_container {
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
  margin: 0 0 14px;
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.6;
  color: rgba(255, 252, 255, 0.75);
}

.section_highlight {
  margin: 0;
  font-family: 'Inter', sans-serif;
  font-size: 17px;
  font-weight: 600;
  line-height: 1.5;
  color: #B08D57;
}

.diff_grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28px;

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
}

.diff_card {
  position: relative;
  background: #1F2933;
  border: 1px solid rgba(255, 252, 255, 0.08);
  border-radius: 20px;
  padding: 36px 32px;
  overflow: hidden;
  transition: all 0.25s ease;
  box-shadow: 0 10px 30px rgba(11, 27, 43, 0.4);

  &:hover {
    border-color: rgba(176, 141, 87, 0.45);
    background: rgba(31, 58, 95, 0.25);
    transform: translateY(-3px);
    box-shadow: 0 16px 40px rgba(11, 27, 43, 0.7);

    .diff_glow {
      opacity: 0.3;
    }
  }
}

.diff_glow {
  position: absolute;
  top: -40px;
  right: -40px;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(176, 141, 87, 0.4) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.diff_tag {
  display: inline-block;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 700;
  color: #B08D57;
  letter-spacing: 0.6px;
  background: rgba(176, 141, 87, 0.12);
  border: 1px solid rgba(176, 141, 87, 0.25);
  padding: 4px 10px;
  border-radius: 6px;
  margin-bottom: 16px;
}

.diff_card_title {
  margin: 0 0 12px;
  font-family: 'Inter', sans-serif;
  font-size: 20px;
  font-weight: 700;
  color: #FFFCFF;
  line-height: 1.3;
}

.diff_card_text {
  margin: 0;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.65;
  color: rgba(255, 252, 255, 0.75);
}
</style>
