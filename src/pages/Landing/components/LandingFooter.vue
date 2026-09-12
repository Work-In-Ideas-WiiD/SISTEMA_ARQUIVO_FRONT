<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import logoAkidocs from '@/assets/imgs/login/logo-akidocs-white.png'
import { trackContactClick } from '@/utils/tracking'

const route = useRoute()
const router = useRouter()

function handleAnchor(hash: string) {
  if (route.path !== '/') {
    router.push(`/${hash}`)
  } else {
    const el = document.querySelector(hash)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }
}
</script>

<template>
  <footer class="landing_footer" role="contentinfo">
    <div class="footer_container">
      <div class="footer_grid">
        <!-- Col 1: Brand & Institutional Info -->
        <div class="footer_brand">
          <RouterLink to="/" class="footer_logo_link" aria-label="AkiDocs Home">
            <img :src="logoAkidocs" alt="AkiDocs — Todos os seus documentos, Aki!" class="footer_logo" width="140" height="36" />
          </RouterLink>
          <p class="footer_brand_desc">
            Todos os seus documentos, Aki! Plataforma SaaS B2B de gestão e compartilhamento seguro de arquivos para empresas.
          </p>
          <div class="footer_company_data">
            <strong>Work in Ideas</strong>
            <span>CNPJ: 17.808.481/0001-69</span>
            <span>Av. T-1, 2266 — Setor Bueno</span>
            <span>Goiânia — GO, CEP 74215-025</span>
          </div>
          <div class="footer_badges">
            <span class="cert_badge">INFRAESTRUTURA NO BRASIL</span>
            <span class="cert_badge">CONFORME LGPD</span>
          </div>
        </div>

        <!-- Col 2: Platform Links -->
        <div class="footer_col">
          <span class="footer_col_title">Plataforma</span>
          <ul class="footer_links">
            <li><button type="button" class="footer_link_btn" @click="handleAnchor('#beneficios')">Benefícios</button></li>
            <li><button type="button" class="footer_link_btn" @click="handleAnchor('#funcionalidades')">Funcionalidades</button></li>
            <li><button type="button" class="footer_link_btn" @click="handleAnchor('#como-funciona')">Como Funciona</button></li>
            <li><button type="button" class="footer_link_btn" @click="handleAnchor('#diferenciais')">Diferenciais</button></li>
            <li><button type="button" class="footer_link_btn" @click="handleAnchor('#seguranca')">Segurança & LGPD</button></li>
            <li><button type="button" class="footer_link_btn" @click="handleAnchor('#continuidade')">Continuidade & SLA</button></li>
            <li><button type="button" class="footer_link_btn" @click="handleAnchor('#planos')">Planos & Preços</button></li>
            <li><button type="button" class="footer_link_btn" @click="handleAnchor('#faq')">Perguntas Frequentes</button></li>
          </ul>
        </div>

        <!-- Col 3: Jurídico & Governança -->
        <div class="footer_col">
          <span class="footer_col_title">Jurídico & Governança</span>
          <ul class="footer_links">
            <li><RouterLink to="/termos-de-uso" class="footer_link">Termos de Uso</RouterLink></li>
            <li><RouterLink to="/politica-de-privacidade" class="footer_link">Política de Privacidade</RouterLink></li>
            <li><RouterLink to="/dpa" class="footer_link">Acordo de Tratamento de Dados (DPA)</RouterLink></li>
            <li><RouterLink to="/sla" class="footer_link">Acordo de Nível de Serviço (SLA)</RouterLink></li>
            <li><RouterLink to="/politica-de-cancelamento" class="footer_link">Política de Cancelamento</RouterLink></li>
            <li><RouterLink to="/sobre" class="footer_link">Sobre a Work in Ideas</RouterLink></li>
            <li><RouterLink to="/cliente" class="footer_link">Portal do Cliente</RouterLink></li>
          </ul>
        </div>

        <!-- Col 4: DPO & Suporte Oficial -->
        <div class="footer_col">
          <span class="footer_col_title">Privacidade & Suporte</span>
          
          <div class="footer_dpo_snippet">
            <span class="footer_dpo_tag">ENCARREGADO DE DADOS (DPO)</span>
            <strong class="footer_dpo_name">Charles Egidio</strong>
            <a href="mailto:charles@wi-id.com" class="footer_dpo_link">charles@wi-id.com</a>
          </div>

          <div class="footer_support_snippet">
            <span class="footer_dpo_tag">SUPORTE TÉCNICO OFICIAL</span>
            <a href="https://suporte.akidocs.com.br" target="_blank" rel="noopener noreferrer" class="footer_support_link">
              <span>suporte.akidocs.com.br</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          </div>

          <ul class="footer_links footer_contacts">
            <li>
              <a
                href="mailto:contato@wi-id.com"
                class="footer_contact_item"
                @click="trackContactClick('email', 'footer', 'contato@wi-id.com')"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ff00ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span>contato@wi-id.com</span>
              </a>
            </li>
            <li>
              <a
                href="https://wa.me/5562983398612"
                target="_blank"
                rel="noopener noreferrer"
                class="footer_contact_item footer_contact_item--whatsapp"
                @click="trackContactClick('whatsapp', 'footer', '5562983398612')"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#25D366" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
                <span>(62) 98339-8612</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="footer_bottom">
        <p class="copyright_text">
          &copy; {{ new Date().getFullYear() }} AkiDocs. Todos os direitos reservados. Desenvolvido por Work in Ideas (CNPJ 17.808.481/0001-69).
        </p>
        <div class="footer_legal_links">
          <RouterLink to="/termos-de-uso">Termos de Uso</RouterLink>
          <span class="sep">•</span>
          <RouterLink to="/politica-de-privacidade">Privacidade</RouterLink>
          <span class="sep">•</span>
          <RouterLink to="/dpa">DPA</RouterLink>
          <span class="sep">•</span>
          <RouterLink to="/sla">SLA</RouterLink>
          <span class="sep">•</span>
          <a href="/sitemap.xml" target="_blank" rel="noopener">Sitemap</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.landing_footer {
  background: #1a1a1a;
  border-top: 1px solid rgba(247, 247, 247, 0.08);
  padding: 80px 24px 40px;
  color: #f7f7f7;
}

.footer_container {
  max-width: 1240px;
  margin: 0 auto;
}

.footer_grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr 1fr;
  gap: 48px;
  margin-bottom: 60px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr 1fr;
    gap: 36px;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}

.footer_brand {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.footer_logo_link {
  display: inline-block;
  text-decoration: none;
}

.footer_logo {
  height: 32px;
  width: auto;
  object-fit: contain;
}

.footer_brand_desc {
  margin: 0;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  line-height: 1.6;
  color: rgba(247, 247, 247, 0.65);
  max-width: 320px;
}

.footer_badges {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
}

.cert_badge {
  display: inline-block;
  font-family: 'Source Code Pro', monospace;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.5px;
  color: #ff00ff;
  background: rgba(255, 0, 255, 0.1);
  border: 1px solid rgba(255, 0, 255, 0.25);
  padding: 3px 8px;
  border-radius: 6px;
}

.footer_company_data {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  color: rgba(247, 247, 247, 0.6);

  strong {
    color: #f7f7f7;
    font-size: 13px;
    margin-bottom: 2px;
  }
}

.footer_dpo_snippet,
.footer_support_snippet {
  background: rgba(121, 121, 121, 0.12);
  border: 1px solid rgba(247, 247, 247, 0.08);
  border-radius: 12px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 14px;
}

.footer_dpo_tag {
  font-family: 'Source Code Pro', monospace;
  font-size: 9px;
  font-weight: 700;
  color: #ff00ff;
  letter-spacing: 0.5px;
}

.footer_dpo_name {
  font-family: 'Source Code Pro', monospace;
  font-size: 13px;
  font-weight: 700;
  color: #f7f7f7;
}

.footer_dpo_link,
.footer_support_link {
  font-family: 'Source Code Pro', monospace;
  font-size: 12px;
  color: rgba(247, 247, 247, 0.75);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: color 0.2s ease;

  &:hover {
    color: #ff00ff;
  }
}

.footer_col {
  display: flex;
  flex-direction: column;
}

.footer_col_title {
  font-family: 'Source Code Pro', monospace;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #f7f7f7;
  margin-bottom: 20px;
}

.footer_links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer_link,
.footer_link_btn {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  color: rgba(247, 247, 247, 0.65);
  text-decoration: none;
  background: transparent;
  border: none;
  padding: 0;
  cursor: pointer;
  text-align: left;
  transition: color 0.2s ease, opacity 0.2s ease;

  &:hover {
    color: #ff00ff;
  }
}

.footer_contact_item {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: 'Source Code Pro', monospace;
  font-size: 13px;
  color: rgba(247, 247, 247, 0.75);
  text-decoration: none;
  transition: all 0.2s ease;

  svg {
    flex-shrink: 0;
  }

  &:hover {
    color: #ff00ff;
    transform: translateX(2px);
  }

  &--whatsapp:hover {
    color: #25D366;
  }
}

.footer_bottom {
  border-top: 1px solid rgba(247, 247, 247, 0.08);
  padding-top: 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.copyright_text {
  margin: 0;
  font-family: 'Inter', sans-serif;
  font-size: 13px;
  color: rgba(247, 247, 247, 0.5);
}

.footer_legal_links {
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: 'Inter', sans-serif;
  font-size: 13px;

  a {
    color: rgba(247, 247, 247, 0.5);
    text-decoration: none;

    &:hover {
      color: #ff00ff;
    }
  }

  .sep {
    color: rgba(247, 247, 247, 0.3);
  }
}
</style>
