<script setup lang="ts">
const benefits = [
  {
    icon: 'folder',
    title: 'Organização centralizada',
    description:
      'Organize arquivos por empresa, setor, função, cliente e usuário para que cada pessoa encontre o que precisa sem depender de pastas espalhadas.'
  },
  {
    icon: 'users',
    title: 'Controle de acesso',
    description:
      'Defina quem pode visualizar, enviar ou acessar determinados arquivos, setores e grupos.'
  },
  {
    icon: 'file-check',
    title: 'Confirmação de leitura',
    description:
      'Saiba quando um documento disponibilizado foi acessado e tenha mais rastreabilidade sobre o compartilhamento das informações.'
  },
  {
    icon: 'building',
    title: 'Portal para clientes',
    description:
      'Disponibilize documentos aos seus clientes em um ambiente organizado, sem exigir a contratação de usuários adicionais.'
  },
  {
    icon: 'shield',
    title: 'Segurança e privacidade',
    description:
      'Utilize uma estrutura com criptografia de arquivos, controle de acesso, isolamento lógico entre empresas e proteção da aplicação.'
  },
  {
    icon: 'cloud',
    title: 'Operação 100% em nuvem',
    description:
      'Acesse o AkiDocs pelo navegador, sem instalar servidores ou softwares na empresa.'
  }
]
</script>

<template>
  <section id="beneficios" class="benefits_section" aria-labelledby="benefits-title">
    <div class="benefits_container">
      <div class="section_header">
        <span class="section_badge">VANTAGENS COMPETITIVAS</span>
        <h2 id="benefits-title" class="section_title">
          Por que centralizar os documentos da sua empresa no AkiDocs?
        </h2>
        <p class="section_subtitle">
          Substitua pastas dispersas, anexos de e-mail e documentos enviados por WhatsApp por uma estrutura organizada, controlada e rastreável.
        </p>
      </div>

      <div class="benefits_grid">
        <div v-for="(item, idx) in benefits" :key="idx" class="benefit_card">
          <div class="card_icon_wrap" aria-hidden="true">
            <!-- Folder Icon -->
            <svg v-if="item.icon === 'folder'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
            <!-- Users Icon -->
            <svg v-else-if="item.icon === 'users'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <!-- File Check Icon -->
            <svg v-else-if="item.icon === 'file-check'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <polyline points="9 15 11 17 15 13"></polyline>
            </svg>
            <!-- Building Icon -->
            <svg v-else-if="item.icon === 'building'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
              <path d="M9 22v-4h6v4"></path>
              <line x1="8" y1="6" x2="8.01" y2="6"></line>
              <line x1="16" y1="6" x2="16.01" y2="6"></line>
              <line x1="8" y1="10" x2="8.01" y2="10"></line>
              <line x1="16" y1="10" x2="16.01" y2="10"></line>
              <line x1="8" y1="14" x2="8.01" y2="14"></line>
              <line x1="16" y1="14" x2="16.01" y2="14"></line>
            </svg>
            <!-- Shield Icon -->
            <svg v-else-if="item.icon === 'shield'" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
            <!-- Cloud Icon -->
            <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path>
            </svg>
          </div>

          <h3 class="benefit_title">{{ item.title }}</h3>
          <p class="benefit_text">{{ item.description }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.benefits_section {
  position: relative;
  padding: 100px 24px;
  background: #212121;
  border-top: 1px solid rgba(247, 247, 247, 0.05);
}

.benefits_container {
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

.benefits_grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;

  @media (max-width: 960px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
}

.benefit_card {
  background: rgba(121, 121, 121, 0.12);
  border: 1px solid rgba(247, 247, 247, 0.08);
  border-radius: 24px;
  padding: 32px 28px;
  transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;

  &:hover {
    transform: translateY(-4px);
    background: rgba(121, 121, 121, 0.2);
    border-color: rgba(255, 0, 255, 0.4);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);
  }
}

.card_icon_wrap {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: rgba(255, 0, 255, 0.12);
  border: 1px solid rgba(255, 0, 255, 0.25);
  color: #ff00ff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 22px;
}

.benefit_title {
  margin: 0 0 12px;
  font-family: 'Source Code Pro', monospace;
  font-size: 18px;
  font-weight: 700;
  color: #f7f7f7;
  line-height: 1.3;
}

.benefit_text {
  margin: 0;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.6;
  color: rgba(247, 247, 247, 0.65);
}
</style>
