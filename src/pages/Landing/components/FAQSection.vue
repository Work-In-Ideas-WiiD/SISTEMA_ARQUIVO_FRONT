<script setup lang="ts">
import { ref } from 'vue'
import { trackEvent } from '@/utils/tracking'
import { faqs } from './faqData'

const activeIndex = ref<number | null>(0)

function toggleFaq(index: number) {
  if (activeIndex.value === index) {
    activeIndex.value = null
  } else {
    activeIndex.value = index
    trackEvent('faq_aberto', { pergunta: faqs[index].question })
    trackEvent('select_content', { content_type: 'faq_accordion', item_id: faqs[index].question })
  }
}
</script>

<template>
  <section id="faq" class="faq_section" aria-labelledby="faq-title">
    <div class="faq_container">
      <div class="section_header">
        <span class="section_badge">TIRE SUAS DÚVIDAS</span>
        <h2 id="faq-title" class="section_title">
          Perguntas Frequentes
        </h2>
        <p class="section_subtitle">
          Reunimos aqui as respostas sobre o funcionamento, limites, infraestrutura, segurança e condições operacionais do AkiDocs.
        </p>
      </div>

      <div class="faq_accordion" role="region" aria-label="Accordion de Perguntas Frequentes">
        <div
          v-for="(faq, idx) in faqs"
          :key="idx"
          class="faq_item"
          :class="{ 'faq_item--open': activeIndex === idx }"
        >
          <button
            type="button"
            class="faq_trigger"
            :aria-expanded="activeIndex === idx"
            :aria-controls="`faq-answer-${idx}`"
            :id="`faq-question-${idx}`"
            @click="toggleFaq(idx)"
          >
            <span class="faq_question">{{ faq.question }}</span>
            <span class="faq_icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </span>
          </button>

          <div
            :id="`faq-answer-${idx}`"
            role="region"
            :aria-labelledby="`faq-question-${idx}`"
            class="faq_content"
            :hidden="activeIndex !== idx"
          >
            <p class="faq_answer" v-html="faq.answer"></p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.faq_section {
  position: relative;
  padding: 100px 24px;
  background: #0B1B2B;
  border-top: 1px solid rgba(255, 252, 255, 0.08);
}

.faq_container {
  max-width: 920px;
  margin: 0 auto;
}

.section_header {
  text-align: center;
  margin-bottom: 56px;
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

.faq_accordion {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.faq_item {
  background: #1F2933;
  border: 1px solid rgba(255, 252, 255, 0.08);
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.25s ease;

  &--open {
    border-color: rgba(176, 141, 87, 0.45);
    background: #1F3A5F33;
    box-shadow: 0 10px 30px rgba(11, 27, 43, 0.6);

    .faq_icon {
      transform: rotate(180deg);
      color: #B08D57;
    }
  }
}

.faq_trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 22px 26px;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
}

.faq_question {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 600;
  color: #FFFCFF;
  line-height: 1.4;
}

.faq_icon {
  color: rgba(255, 252, 255, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.25s ease, color 0.25s ease;
  flex-shrink: 0;
}

.faq_content {
  padding: 0 26px 24px;
}

.faq_answer {
  margin: 0;
  font-family: 'Inter', sans-serif;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.65;
  color: rgba(255, 252, 255, 0.8);
  border-top: 1px solid rgba(255, 252, 255, 0.08);
  padding-top: 16px;

  :deep(.faq_inline_link) {
    color: #B08D57;
    text-decoration: underline;
    text-underline-offset: 3px;
    font-weight: 600;
    transition: color 0.2s ease;

    &:hover {
      color: #FFFCFF;
    }
  }
}
</style>
