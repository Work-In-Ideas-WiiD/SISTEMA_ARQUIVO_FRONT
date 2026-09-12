<script setup lang="ts">
import { RouterLink } from 'vue-router'

const providers = [
  {
    name: 'DigitalOcean',
    role: 'Infraestrutura & Processamento',
    description: 'Servidores de aplicação e armazenamento corporativo de arquivos com alta performance.'
  },
  {
    name: 'Amazon Web Services (AWS)',
    role: 'Nuvem & Armazenamento Seguro',
    description: 'Infraestrutura de nuvem resiliente, escalável e com armazenamento redundante.'
  },
  {
    name: 'Cloudflare',
    role: 'Proteção de Acesso & Borda',
    description: 'Gerenciamento de tráfego, mitigação contra ataques DDoS e certificado SSL/TLS de ponta.'
  },
  {
    name: 'PagSeguro',
    role: 'Processamento de Pagamentos',
    description: 'Gateway certificado PCI-DSS para cobrança de assinaturas com total segurança financeira.'
  }
]

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
    title: 'Infraestrutura no Brasil',
    description: 'A infraestrutura principal utilizada para processamento e custódia dos dados e arquivos está configurada em datacenters localizados no Brasil, em São Paulo, garantindo baixa latência e conformidade local.'
  },
  {
    title: 'Privacidade Total do Conteúdo',
    description: 'O AkiDocs não realiza leitura, interpretação ou análise do conteúdo dos documentos armazenados. A equipe da Work in Ideas não possui acesso ao conteúdo legível dos arquivos enviados pelos clientes.'
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
          O AkiDocs foi desenvolvido para armazenar e disponibilizar documentos empresariais com controles de segurança, privacidade e acesso compatíveis com a natureza do serviço.
        </p>
      </div>

      <!-- Security Pillars Grid -->
      <div class="pillars_grid">
        <div v-for="(pillar, idx) in securityPillars" :key="idx" class="pillar_card">
          <div class="pillar_icon_wrap" aria-hidden="true">
            <!-- Shield check icon -->
            <svg v-if="idx === 0" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
            <svg v-else-if="idx === 1" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <svg v-else-if="idx === 2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            </svg>
            <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
              <line x1="1" y1="1" x2="23" y2="23"></line>
            </svg>
          </div>
          <h3 class="pillar_title">{{ pillar.title }}</h3>
          <p class="pillar_text">{{ pillar.description }}</p>
        </div>
      </div>

      <!-- Infrastructure Providers Box -->
      <div class="providers_box">
        <div class="providers_box__header">
          <span class="providers_tag">PROVEDORES HOMOLOGADOS</span>
          <h3 class="providers_heading">Infraestrutura e parceiros tecnológicos de classe mundial</h3>
          <p class="providers_sub">A plataforma opera sobre componentes e serviços de provedores líderes globais em infraestrutura e segurança:</p>
        </div>

        <div class="providers_grid">
          <div v-for="(prov, pIdx) in providers" :key="pIdx" class="provider_card">
            <span class="provider_role">{{ prov.role }}</span>
            <h4 class="provider_name">{{ prov.name }}</h4>
            <p class="provider_desc">{{ prov.description }}</p>
          </div>
        </div>
      </div>

      <!-- LGPD Section Card -->
      <div class="lgpd_card">
        <div class="lgpd_content">
          <div class="lgpd_tag_wrap">
            <span class="lgpd_tag">CONFORMIDADE REGULATÓRIA</span>
            <span class="lgpd_badge">LEI Nº 13.709/2018 (LGPD)</span>
          </div>

          <h3 class="lgpd_title">Como o AkiDocs atua em relação à LGPD</h3>

          <div class="lgpd_roles">
            <div class="role_block">
              <strong class="role_title">Empresa-cliente como Controladora</strong>
              <p class="role_text">
                Quando uma empresa utiliza o AkiDocs para cadastrar usuários, clientes, grupos, permissões, documentos e demais informações de sua operação, a empresa-cliente atua como <strong>Controladora</strong> desses dados e a Work in Ideas atua como <strong>Operadora</strong>, realizando o tratamento estritamente necessário à prestação do serviço conforme as instruções da empresa-cliente.
              </p>
            </div>

            <div class="role_block">
              <strong class="role_title">Work in Ideas como Controladora</strong>
              <p class="role_text">
                Para os dados necessários à própria operação do AkiDocs — como cadastro do contratante, faturamento, autenticação, segurança, logs operacionais e suporte técnico — a Work in Ideas atua como <strong>Controladora</strong>.
              </p>
            </div>
          </div>

          <!-- DPO Contact Box -->
          <div class="dpo_box">
            <div class="dpo_info">
              <div class="dpo_avatar">CE</div>
              <div>
                <strong class="dpo_name">Charles Egidio</strong>
                <span class="dpo_role">Gerente de Projetos e Encarregado de Proteção de Dados (DPO)</span>
                <a href="mailto:charles@wi-id.com" class="dpo_email">charles@wi-id.com</a>
              </div>
            </div>

            <div class="dpo_actions">
              <RouterLink to="/politica-de-privacidade" class="dpo_btn dpo_btn--primary">
                Política de Privacidade
              </RouterLink>
              <RouterLink to="/dpa" class="dpo_btn dpo_btn--secondary">
                Acordo de Tratamento de Dados (DPA)
              </RouterLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.security_section {
  position: relative;
  padding: 100px 24px;
  background: #252525;
  border-top: 1px solid rgba(247, 247, 247, 0.05);
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

/* Pillars Grid */
.pillars_grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-bottom: 48px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.pillar_card {
  background: rgba(33, 33, 33, 0.85);
  border: 1px solid rgba(247, 247, 247, 0.08);
  border-radius: 24px;
  padding: 32px 28px;
  display: flex;
  flex-direction: column;
  transition: all 0.25s ease;

  &:hover {
    border-color: rgba(255, 0, 255, 0.35);
    background: rgba(33, 33, 33, 0.98);
    transform: translateY(-3px);
    box-shadow: 0 14px 35px rgba(0, 0, 0, 0.5);
  }
}

.pillar_icon_wrap {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: rgba(255, 0, 255, 0.12);
  border: 1px solid rgba(255, 0, 255, 0.25);
  color: #ff00ff;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
}

.pillar_title {
  margin: 0 0 12px;
  font-family: 'Source Code Pro', monospace;
  font-size: 18px;
  font-weight: 700;
  color: #f7f7f7;
  line-height: 1.3;
}

.pillar_text {
  margin: 0;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.65;
  color: rgba(247, 247, 247, 0.7);
}

/* Providers Box */
.providers_box {
  background: rgba(121, 121, 121, 0.1);
  border: 1px solid rgba(247, 247, 247, 0.08);
  border-radius: 24px;
  padding: 36px 32px;
  margin-bottom: 48px;
}

.providers_box__header {
  margin-bottom: 28px;
}

.providers_tag {
  display: inline-block;
  font-family: 'Source Code Pro', monospace;
  font-size: 10px;
  font-weight: 700;
  color: #ff00ff;
  letter-spacing: 0.8px;
  margin-bottom: 8px;
}

.providers_heading {
  margin: 0 0 8px;
  font-family: 'Source Code Pro', monospace;
  font-size: 20px;
  font-weight: 700;
  color: #f7f7f7;
}

.providers_sub {
  margin: 0;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: rgba(247, 247, 247, 0.65);
}

.providers_grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
}

.provider_card {
  background: rgba(33, 33, 33, 0.7);
  border: 1px solid rgba(247, 247, 247, 0.06);
  border-radius: 16px;
  padding: 20px 18px;
  display: flex;
  flex-direction: column;
}

.provider_role {
  font-family: 'Source Code Pro', monospace;
  font-size: 10px;
  font-weight: 600;
  color: #ff00ff;
  margin-bottom: 6px;
  text-transform: uppercase;
}

.provider_name {
  margin: 0 0 8px;
  font-family: 'Source Code Pro', monospace;
  font-size: 15px;
  font-weight: 700;
  color: #f7f7f7;
}

.provider_desc {
  margin: 0;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  line-height: 1.5;
  color: rgba(247, 247, 247, 0.6);
}

/* LGPD Card */
.lgpd_card {
  background: radial-gradient(circle at 80% 20%, rgba(255, 0, 255, 0.08) 0%, rgba(33, 33, 33, 0.95) 70%), #212121;
  border: 1px solid rgba(255, 0, 255, 0.25);
  border-radius: 28px;
  padding: 40px 36px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);

  @media (max-width: 768px) {
    padding: 28px 20px;
  }
}

.lgpd_tag_wrap {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 16px;
}

.lgpd_tag {
  font-family: 'Source Code Pro', monospace;
  font-size: 11px;
  font-weight: 700;
  color: #ff00ff;
  letter-spacing: 0.5px;
}

.lgpd_badge {
  font-family: 'Source Code Pro', monospace;
  font-size: 10px;
  font-weight: 700;
  background: rgba(255, 0, 255, 0.15);
  color: #ff00ff;
  padding: 3px 10px;
  border-radius: 12px;
  border: 1px solid rgba(255, 0, 255, 0.3);
}

.lgpd_title {
  margin: 0 0 24px;
  font-family: 'Source Code Pro', monospace;
  font-size: clamp(22px, 2.2vw, 28px);
  font-weight: 800;
  color: #f7f7f7;
}

.lgpd_roles {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  margin-bottom: 32px;

  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
}

.role_block {
  background: rgba(121, 121, 121, 0.1);
  border: 1px solid rgba(247, 247, 247, 0.08);
  border-radius: 18px;
  padding: 22px 20px;
}

.role_title {
  display: block;
  font-family: 'Source Code Pro', monospace;
  font-size: 15px;
  font-weight: 700;
  color: #f7f7f7;
  margin-bottom: 10px;
}

.role_text {
  margin: 0;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.65;
  color: rgba(247, 247, 247, 0.72);

  strong {
    color: #f7f7f7;
  }
}

/* DPO Box */
.dpo_box {
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(247, 247, 247, 0.1);
  border-radius: 20px;
  padding: 24px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
}

.dpo_info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.dpo_avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #ff00ff;
  color: #ffffff;
  font-family: 'Source Code Pro', monospace;
  font-size: 15px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.dpo_name {
  display: block;
  font-family: 'Source Code Pro', monospace;
  font-size: 16px;
  font-weight: 700;
  color: #f7f7f7;
}

.dpo_role {
  display: block;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: rgba(247, 247, 247, 0.6);
  margin-bottom: 2px;
}

.dpo_email {
  font-family: 'Source Code Pro', monospace;
  font-size: 13px;
  color: #ff00ff;
  text-decoration: underline;

  &:hover {
    color: #ffffff;
  }
}

.dpo_actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.dpo_btn {
  font-family: 'Source Code Pro', monospace;
  font-size: 12px;
  font-weight: 700;
  padding: 10px 18px;
  border-radius: 20px;
  text-decoration: none;
  transition: all 0.2s ease;

  &--primary {
    background: rgba(255, 0, 255, 0.15);
    border: 1px solid rgba(255, 0, 255, 0.35);
    color: #ff00ff;

    &:hover {
      background: #ff00ff;
      color: #ffffff;
    }
  }

  &--secondary {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(247, 247, 247, 0.2);
    color: #f7f7f7;

    &:hover {
      background: rgba(255, 255, 255, 0.15);
      border-color: #f7f7f7;
    }
  }
}
</style>
