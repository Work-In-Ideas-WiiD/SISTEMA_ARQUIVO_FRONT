<script setup lang="ts">
const differentials = [
  {
    tag: 'ESTRUTURA DEDICADA',
    title: 'Muito além de um drive compartilhado',
    description: 'Drives convencionais viram labirintos de links e pastas desorganizadas. O WiiDocs cria um ecossistema corporativo completo com setores, cargos, clientes e controle rigoroso de governança documental.'
  },
  {
    tag: 'FOCO OPERACIONAL',
    title: 'Interface ultrarrápida sem ruídos visuais',
    description: 'Desenvolvido sob uma arquitetura Dark Mode moderna de alto contraste que preserva a atenção visual, reduz cliques desnecessários e dispensa treinamentos complexos para a equipe.'
  },
  {
    tag: 'ESCALABILIDADE',
    title: 'Previsibilidade de custos sem surpresas',
    description: 'Defina claramente suas necessidades de armazenamento e colaboradores com planos claros. Expanda seus clientes e arquivos conforme sua demanda cresce.'
  },
  {
    tag: 'COMPLIANCE',
    title: 'Segurança em nível empresarial & LGPD',
    description: 'Tráfego criptografado, sessões autenticadas por token, separação lógica de dados e rastreabilidade total de acessos para manter sua operação segura contra incidentes e vazamentos.'
  }
]
</script>

<template>
  <section id="diferenciais" class="differentials_section" aria-labelledby="diff-title">
    <div class="diff_container">
      <div class="section_header">
        <span class="section_badge">DIFERENCIAIS EXCLUSIVOS</span>
        <h2 id="diff-title" class="section_title">
          Por que líderes corporativos escolhem o WiiDocs?
        </h2>
        <p class="section_subtitle">
          Uma plataforma concebida para quem não pode perder tempo com ferramentas genéricas ou burocracia desnecessária.
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
  background: #252525;
}

.diff_container {
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
  background: rgba(33, 33, 33, 0.85);
  border: 1px solid rgba(247, 247, 247, 0.08);
  border-radius: 24px;
  padding: 36px 32px;
  overflow: hidden;
  transition: all 0.25s ease;

  &:hover {
    border-color: rgba(255, 0, 255, 0.35);
    transform: translateY(-3px);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);

    .diff_glow {
      opacity: 0.2;
    }
  }
}

.diff_glow {
  position: absolute;
  top: 0;
  right: 0;
  width: 160px;
  height: 160px;
  background: radial-gradient(circle, #ff00ff 0%, transparent 70%);
  opacity: 0.05;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.diff_tag {
  display: inline-block;
  font-family: 'Source Code Pro', monospace;
  font-size: 11px;
  font-weight: 700;
  color: #ff00ff;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

.diff_card_title {
  margin: 0 0 14px;
  font-family: 'Source Code Pro', monospace;
  font-size: 21px;
  font-weight: 700;
  color: #f7f7f7;
  line-height: 1.3;
}

.diff_card_text {
  margin: 0;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.65;
  color: rgba(247, 247, 247, 0.7);
}
</style>
