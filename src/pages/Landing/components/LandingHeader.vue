<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink, useRoute, useRouter } from 'vue-router'
import logoAkidocs from '@/assets/imgs/login/logo-akidocs-white.png'
import { trackLoginClick, trackCtaClick } from '@/utils/tracking'

const route = useRoute()
const router = useRouter()
const isScrolled = ref(false)
const mobileMenuOpen = ref(false)

function onScroll() {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})

function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

function closeMobileMenu() {
  mobileMenuOpen.value = false
}

function handleNavClick(hash: string) {
  closeMobileMenu()
  if (route.path !== '/') {
    router.push(`/${hash}`)
  } else {
    const el = document.querySelector(hash)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }
}

function onLoginClick(local: string = 'header') {
  closeMobileMenu()
  trackLoginClick(local)
}

function onStartClick(local: string = 'header') {
  closeMobileMenu()
  trackCtaClick('testar_gratis', local)
}
</script>

<template>
  <header class="landing_header" :class="{ 'landing_header--scrolled': isScrolled }">
    <div class="landing_header__container">
      <RouterLink to="/" class="landing_header__logo_link" aria-label="AkiDocs Home">
        <img :src="logoAkidocs" alt="AkiDocs — Todos os seus documentos, Aki!" class="landing_header__logo" width="130" height="34" />
      </RouterLink>

      <nav class="landing_header__nav" aria-label="Navegação principal">
        <button type="button" class="nav_link" @click="handleNavClick('#beneficios')">
          Benefícios
        </button>
        <button type="button" class="nav_link" @click="handleNavClick('#funcionalidades')">
          Funcionalidades
        </button>
        <button type="button" class="nav_link" @click="handleNavClick('#como-funciona')">
          Como Funciona
        </button>
        <button type="button" class="nav_link" @click="handleNavClick('#diferenciais')">
          Diferenciais
        </button>
        <button type="button" class="nav_link" @click="handleNavClick('#seguranca')">
          Segurança & LGPD
        </button>
        <button type="button" class="nav_link" @click="handleNavClick('#planos')">
          Planos
        </button>
        <button type="button" class="nav_link" @click="handleNavClick('#faq')">
          FAQ
        </button>
      </nav>

      <div class="header_nav_divider" aria-hidden="true"></div>

      <div class="landing_header__actions">
        <RouterLink to="/login" class="header_btn header_btn--outline" @click="onLoginClick('header')">
          LOGIN
        </RouterLink>
        <RouterLink to="/cadastro" class="header_btn header_btn--primary" @click="onStartClick('header')">
          TESTAR GRÁTIS
        </RouterLink>
      </div>

      <button
        type="button"
        class="landing_header__hamburger"
        :aria-expanded="mobileMenuOpen"
        aria-label="Abrir menu de navegação"
        @click="toggleMobileMenu"
      >
        <span class="hamburger_line" :class="{ 'hamburger_line--open-1': mobileMenuOpen }"></span>
        <span class="hamburger_line" :class="{ 'hamburger_line--open-2': mobileMenuOpen }"></span>
        <span class="hamburger_line" :class="{ 'hamburger_line--open-3': mobileMenuOpen }"></span>
      </button>
    </div>

    <!-- Mobile Drawer -->
    <transition name="mobile-menu-fade">
      <div v-if="mobileMenuOpen" class="mobile_drawer" role="dialog" aria-modal="true">
        <nav class="mobile_drawer__nav">
          <button type="button" class="mobile_nav_link" @click="handleNavClick('#beneficios')">
            Benefícios
          </button>
          <button type="button" class="mobile_nav_link" @click="handleNavClick('#funcionalidades')">
            Funcionalidades
          </button>
          <button type="button" class="mobile_nav_link" @click="handleNavClick('#como-funciona')">
            Como Funciona
          </button>
          <button type="button" class="mobile_nav_link" @click="handleNavClick('#diferenciais')">
            Diferenciais
          </button>
          <button type="button" class="mobile_nav_link" @click="handleNavClick('#seguranca')">
            Segurança & LGPD
          </button>
          <button type="button" class="mobile_nav_link" @click="handleNavClick('#planos')">
            Planos & Preços
          </button>
          <button type="button" class="mobile_nav_link" @click="handleNavClick('#faq')">
            Perguntas Frequentes
          </button>
          <RouterLink to="/sobre" class="mobile_nav_link" @click="closeMobileMenu">
            Sobre Nós
          </RouterLink>

          <div class="mobile_drawer__actions">
            <RouterLink to="/login" class="mobile_btn mobile_btn--outline" @click="onLoginClick('mobile_menu')">
              LOGIN
            </RouterLink>
            <RouterLink to="/cadastro" class="mobile_btn mobile_btn--primary" @click="onStartClick('mobile_menu')">
              TESTAR GRÁTIS
            </RouterLink>
          </div>
        </nav>
      </div>
    </transition>
  </header>
</template>

<style lang="scss" scoped>
.landing_header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  height: 80px;
  background: rgba(33, 33, 33, 0.7);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(247, 247, 247, 0.08);
  transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;

  &--scrolled {
    background: rgba(25, 25, 25, 0.92);
    border-bottom-color: rgba(255, 0, 255, 0.2);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  }

  &__container {
    max-width: 1360px;
    height: 100%;
    margin: 0 auto;
    padding: 0 24px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
  }

  &__logo_link {
    display: inline-flex;
    align-items: center;
    text-decoration: none;
    transition: opacity 0.2s ease;
    flex-shrink: 0;

    &:hover {
      opacity: 0.9;
    }
  }

  &__logo {
    width: auto;
    height: 32px;
    object-fit: contain;
  }

  &__nav {
    display: flex;
    align-items: center;
    gap: clamp(10px, 1.4vw, 22px);
    margin-left: auto;
    margin-right: clamp(16px, 2vw, 32px);

    @media (max-width: 1100px) {
      display: none;
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;

    @media (max-width: 1100px) {
      display: none;
    }
  }

  &__hamburger {
    display: none;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 5px;
    width: 44px;
    height: 44px;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0;
    margin-left: auto;

    @media (max-width: 1100px) {
      display: flex;
    }
  }
}

.header_nav_divider {
  width: 1px;
  height: 22px;
  background: rgba(247, 247, 247, 0.15);
  margin-right: clamp(16px, 2vw, 28px);
  flex-shrink: 0;

  @media (max-width: 1100px) {
    display: none;
  }
}

.hamburger_line {
  width: 24px;
  height: 2px;
  background-color: #f7f7f7;
  border-radius: 2px;
  transition: transform 0.25s ease, opacity 0.25s ease;

  &--open-1 {
    transform: translateY(7px) rotate(45deg);
  }

  &--open-2 {
    opacity: 0;
  }

  &--open-3 {
    transform: translateY(-7px) rotate(-45deg);
  }
}

.nav_link {
  background: transparent;
  border: none;
  font-family: 'Source Code Pro', monospace;
  font-size: 13px;
  font-weight: 500;
  color: #f7f7f7;
  opacity: 0.8;
  cursor: pointer;
  padding: 6px 0;
  transition: opacity 0.2s ease, color 0.2s ease;
  text-decoration: none;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    opacity: 1;
    color: #ff00ff;
  }
}

.header_btn {
  font-family: 'Source Code Pro', monospace;
  font-size: 12.5px;
  font-weight: 700;
  letter-spacing: 0.5px;
  text-decoration: none;
  padding: 8px 18px;
  border-radius: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  white-space: nowrap;
  flex-shrink: 0;

  &--outline {
    background: transparent;
    color: #f7f7f7;
    border: 1px solid rgba(247, 247, 247, 0.35);

    &:hover {
      border-color: #ff00ff;
      color: #ff00ff;
      background: rgba(255, 0, 255, 0.08);
    }
  }

  &--primary {
    background: #f7f7f7;
    color: #212121;
    border: 1px solid transparent;

    &:hover {
      background: #ffffff;
      box-shadow: 0 0 16px rgba(255, 0, 255, 0.45);
      transform: translateY(-1px);
    }
  }
}

/* Mobile Drawer */
.mobile_drawer {
  position: fixed;
  top: 80px;
  left: 0;
  right: 0;
  bottom: 0;
  height: calc(100dvh - 80px);
  background: rgba(25, 25, 25, 0.98);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  z-index: 999;
  padding: 32px 24px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow-y: auto;

  &__nav {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  &__actions {
    margin-top: 32px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
}

.mobile_nav_link {
  background: transparent;
  border: none;
  text-align: left;
  font-family: 'Source Code Pro', monospace;
  font-size: 18px;
  font-weight: 600;
  color: #f7f7f7;
  padding: 12px 0;
  border-bottom: 1px solid rgba(247, 247, 247, 0.08);
  cursor: pointer;
  text-decoration: none;

  &:hover {
    color: #ff00ff;
  }
}

.mobile_btn {
  font-family: 'Source Code Pro', monospace;
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
  padding: 14px;
  border-radius: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;

  &--outline {
    border: 1px solid rgba(247, 247, 247, 0.4);
    color: #f7f7f7;
  }

  &--primary {
    background: #f7f7f7;
    color: #212121;
    border: none;
  }
}

.mobile-menu-fade-enter-active,
.mobile-menu-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.mobile-menu-fade-enter-from,
.mobile-menu-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
