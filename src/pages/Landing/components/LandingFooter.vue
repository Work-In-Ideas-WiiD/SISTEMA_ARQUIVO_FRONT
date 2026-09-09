<script setup lang="ts">
import { RouterLink, useRoute, useRouter } from 'vue-router'
import logoWiidocs from '@/assets/imgs/login/logo-wiidocs-white.png'
import { trackLoginClick, trackCtaClick, trackContactClick } from '@/utils/tracking'

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
        <!-- Col 1: Brand & Summary -->
        <div class="footer_brand">
          <RouterLink to="/" class="footer_logo_link" aria-label="WiiDocs Home">
            <img :src="logoWiidocs" alt="WiiDocs - Gestão Inteligente de Documentos Corporativos" class="footer_logo" width="140" height="36" />
          </RouterLink>
          <p class="footer_brand_desc">
            Plataforma corporativa de gestão de arquivos, contratos e clientes na nuvem.
            Segurança, velocidade e conformidade legal para a sua empresa.
          </p>
          <div class="footer_badges">
            <span class="cert_badge">LGPD COMPLIANT</span>
            <span class="cert_badge">SSL 256-BIT</span>
          </div>
        </div>

        <!-- Col 2: Platform Links -->
        <div class="footer_col">
          <span class="footer_col_title">Plataforma</span>
          <ul class="footer_links">
            <li><button type="button" class="footer_link_btn" @click="handleAnchor('#beneficios')">Benefícios</button></li>
            <li><button type="button" class="footer_link_btn" @click="handleAnchor('#funcionalidades')">Funcionalidades</button></li>
            <li><button type="button" class="footer_link_btn" @click="handleAnchor('#como-funciona')">Como Funciona</button></li>
            <li><button type="button" class="footer_link_btn" @click="handleAnchor('#planos')">Planos & Preços</button></li>
            <li><button type="button" class="footer_link_btn" @click="handleAnchor('#faq')">Perguntas Frequentes</button></li>
          </ul>
        </div>

        <!-- Col 3: Institutional Links -->
        <div class="footer_col">
          <span class="footer_col_title">Institucional</span>
          <ul class="footer_links">
            <li><RouterLink to="/sobre" class="footer_link">Sobre Nós</RouterLink></li>
            <li><RouterLink to="/politica-de-privacidade" class="footer_link">Política de Privacidade</RouterLink></li>
            <li><RouterLink to="/termos-de-uso" class="footer_link">Termos de Uso</RouterLink></li>
            <li><RouterLink to="/login" class="footer_link" @click="trackLoginClick('footer')">Acessar Conta (Login)</RouterLink></li>
            <li><RouterLink to="/cadastro" class="footer_link" @click="trackCtaClick('criar_conta', 'footer')">Criar Nova Conta</RouterLink></li>
            <li><RouterLink to="/cliente" class="footer_link">Portal do Cliente</RouterLink></li>
          </ul>
        </div>

        <!-- Col 4: Contato & Suporte -->
        <div class="footer_col">
          <span class="footer_col_title">Contato & Suporte</span>
          <ul class="footer_links footer_contacts">
            <li>
              <a
                href="mailto:contato@wi-id.com"
                class="footer_contact_item"
                @click="trackContactClick('email', 'footer', 'contato@wi-id.com')"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ff00ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span>contato@wi-id.com</span>
              </a>
            </li>
            <li>
              <a
                href="mailto:desenvolvimento@wi-id.com"
                class="footer_contact_item"
                @click="trackContactClick('email', 'footer', 'desenvolvimento@wi-id.com')"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ff00ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <polyline points="16 18 22 12 16 6"></polyline>
                  <polyline points="8 6 2 12 8 18"></polyline>
                </svg>
                <span>desenvolvimento@wi-id.com</span>
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
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#25D366" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
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
          &copy; {{ new Date().getFullYear() }} WiiDocs. Todos os direitos reservados. Desenvolvido por Work In Ideas (WiiD).
        </p>
        <div class="footer_legal_links">
          <RouterLink to="/politica-de-privacidade">Privacidade</RouterLink>
          <span class="sep">•</span>
          <RouterLink to="/termos-de-uso">Termos de Uso</RouterLink>
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
