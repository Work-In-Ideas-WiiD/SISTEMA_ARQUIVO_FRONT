<script setup lang="ts">
const steps = [
  {
    number: '01',
    title: 'Crie sua conta',
    description: 'Cadastre sua empresa e comece seu teste gratuito de 8 dias.'
  },
  {
    number: '02',
    title: 'Estruture sua organização',
    description: 'Cadastre setores, funções, funcionários, clientes e grupos de acordo com a realidade da sua empresa.'
  },
  {
    number: '03',
    title: 'Envie seus arquivos',
    description: 'Organize os documentos em pastas e defina quem poderá acessá-los.'
  },
  {
    number: '04',
    title: 'Compartilhe e acompanhe',
    description: 'Disponibilize arquivos aos usuários e clientes autorizados e acompanhe os acessos e confirmações de leitura.'
  }
]
</script>

<template>
  <section id="como-funciona" class="how_it_works_section" aria-labelledby="how-it-works-title">
    <div class="how_container">
      <div class="section_header">
        <span class="section_badge">PASSO A PASSO</span>
        <h2 id="how-it-works-title" class="section_title">
          Como funciona o AkiDocs na prática?
        </h2>
        <p class="section_subtitle">
          Uma implantação ágil e sem complicações para que sua equipe comece a operar pelo navegador desde o primeiro dia.
        </p>
      </div>

      <div class="steps_grid">
        <div v-for="(step, idx) in steps" :key="idx" class="step_card">
          <div class="step_number_wrap">
            <span class="step_number">{{ step.number }}</span>
            <div v-if="idx < steps.length - 1" class="step_connector" aria-hidden="true"></div>
          </div>
          <h3 class="step_title">{{ step.title }}</h3>
          <p class="step_description">{{ step.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.how_it_works_section {
  position: relative;
  padding: 100px 24px;
  background: #0B1B2B;
  border-top: 1px solid rgba(255, 252, 255, 0.08);
}

.how_container {
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

.steps_grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 32px;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}

.step_card {
  background: #1F2933;
  border: 1px solid rgba(255, 252, 255, 0.08);
  border-radius: 20px;
  padding: 36px 30px;
  display: flex;
  flex-direction: column;
  position: relative;
  transition: transform 0.25s ease, border-color 0.25s ease;
  box-shadow: 0 10px 30px rgba(11, 27, 43, 0.4);

  &:hover {
    transform: translateY(-4px);
    border-color: rgba(176, 141, 87, 0.45);
    background: rgba(31, 58, 95, 0.25);
    box-shadow: 0 16px 36px rgba(11, 27, 43, 0.7);
  }
}

.step_number_wrap {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.step_number {
  font-family: 'Inter', sans-serif;
  font-size: 20px;
  font-weight: 800;
  color: #B08D57;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(176, 141, 87, 0.15);
  border: 1px solid rgba(176, 141, 87, 0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.step_connector {
  flex-grow: 1;
  height: 1px;
  background: rgba(176, 141, 87, 0.25);

  @media (max-width: 1100px) {
    display: none;
  }
}

.step_title {
  margin: 0 0 12px;
  font-family: 'Inter', sans-serif;
  font-size: 19px;
  font-weight: 700;
  color: #FFFCFF;
  line-height: 1.3;
}

.step_description {
  margin: 0;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.65;
  color: rgba(255, 252, 255, 0.75);
}
</style>
