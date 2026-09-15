<script setup lang="ts">
const securityPillars = [
  {
    title: 'Criptografia na Infraestrutura',
    description: 'Os arquivos armazenados no AkiDocs permanecem criptografados na infraestrutura utilizada pela plataforma, mantendo o sigilo e a integridade de cada documento corporativo.'
  },
  {
    title: 'Isolamento Lógico entre Empresas',
    description: 'Os ambientes das empresas-clientes são estritamente segregados. Cada usuário ou cliente externo somente pode visualizar e acessar as informações para as quais possui autorização expressa.'
  },
  {
    title: 'Infraestrutura Redundante e Segura',
    description: 'A infraestrutura utilizada para processamento e custódia dos dados e arquivos opera em datacenters certificados no Brasil e no exterior, garantindo redundância, alta disponibilidade e conformidade.'
  },
  {
    title: 'Privacidade Total do Conteúdo',
    description: 'O AkiDocs não realiza leitura, interpretação ou análise do conteúdo dos documentos armazenados. O acesso aos arquivos ocorre estritamente para fins técnicos e operacionais sob autorização expressa.'
  }
]
</script>

<template>
  <section id="seguranca" class="security_section" aria-labelledby="security-title">
    <div class="security_container">
      <!-- Section Header -->
      <div class="section_header">
        <span class="section_badge">SEGURANÇA & PRIVACIDADE</span>
        <h2 id="security-title" class="section_title">
          Segurança e privacidade fazem parte da estrutura do AkiDocs
        </h2>
        <p class="section_subtitle">
          O AkiDocs foi desenvolvido para armazenar e disponibilizar documentos empresariais com controles de segurança, privacidade e acesso compatíveis com a natureza corporativa do serviço.
        </p>
      </div>

      <!-- Security Pillars Grid -->
      <div class="pillars_grid">
        <div v-for="(pillar, idx) in securityPillars" :key="idx" class="pillar_card">
          <div class="pillar_icon_wrap" aria-hidden="true">
            <!-- Shield lock icon -->
            <svg v-if="idx === 0" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <!-- Logical isolation icon -->
            <svg v-else-if="idx === 1" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <!-- Global / Data centers icon -->
            <svg v-else-if="idx === 2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            <!-- Privacy eye off icon -->
            <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
              <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
          </div>
          <h3 class="pillar_title">{{ pillar.title }}</h3>
          <p class="pillar_text">{{ pillar.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.security_section {
  position: relative;
  padding: 100px 24px;
  background: #0B1B2B;
  border-top: 1px solid rgba(255, 252, 255, 0.08);
}

.security_container {
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

.pillars_grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28px;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
}

.pillar_card {
  background: #1F2933;
  border: 1px solid rgba(255, 252, 255, 0.08);
  border-radius: 20px;
  padding: 36px 32px;
  transition: all 0.25s ease;
  box-shadow: 0 10px 30px rgba(11, 27, 43, 0.4);

  &:hover {
    border-color: rgba(176, 141, 87, 0.45);
    background: rgba(31, 58, 95, 0.25);
    transform: translateY(-4px);
    box-shadow: 0 16px 36px rgba(11, 27, 43, 0.7);
  }
}

.pillar_icon_wrap {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  background: rgba(176, 141, 87, 0.15);
  border: 1px solid rgba(176, 141, 87, 0.3);
  color: #B08D57;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.pillar_title {
  margin: 0 0 12px;
  font-family: 'Inter', sans-serif;
  font-size: 19px;
  font-weight: 700;
  color: #FFFCFF;
  line-height: 1.3;
}

.pillar_text {
  margin: 0;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.65;
  color: rgba(255, 252, 255, 0.75);
}
</style>
