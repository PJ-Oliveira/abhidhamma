import { describe, it, expect } from 'vitest';
import { initExportPanel, segToHtml } from '../../src/export.js';
import { renderSegments } from '../../src/reader.js';
import type { Manifest, Segment } from '../../src/types.js';

describe('Export UI Panel & 5-Version Contemporary Commentaries', () => {
  it('should render the export panel UI for canonical works with 8 language options', () => {
    const container = document.createElement('div');
    const mockManifest: Manifest = {
      groups: {
        abhidhamma: [
          {
            id: 'test-work',
            title: 'Test Work',
            parts: {}
          }
        ]
      }
    };

    initExportPanel(mockManifest, container, () => 'test-work');
    expect(container.innerHTML).toContain('Test Work');
    const langSel = container.querySelector('#export-lang') as HTMLSelectElement;
    expect(langSel.options.length).toBe(8);
  });

  it('should expose the exact 5 versions when a trilingual Contemporary Commentary is selected', () => {
    const container = document.createElement('div');
    const mockManifest: Manifest = {
      groups: {
        comentarios: [
          {
            id: 'lessons-in-abhidhamma',
            title: 'Lessons in Abhidhamma',
            languages: ['en', 'pt', 'es'],
            parts: {
              texto: { label: 'Text', files: ['texto.json'], toc: [], count: 455 }
            }
          },
          {
            id: 'buddhism-in-daily-life',
            title: 'Buddhism in Daily Life',
            parts: {
              texto: { label: 'Text', files: ['texto.json'], toc: [], count: 343 }
            }
          }
        ]
      }
    };

    initExportPanel(mockManifest, container, () => 'lessons-in-abhidhamma');
    const langSel = container.querySelector('#export-lang') as HTMLSelectElement;
    const values = Array.from(langSel.options).map((o) => o.value);
    expect(values).toEqual(['en', 'pali+pt', 'pali+es', 'pt', 'es']);

    // Switching to legacy EN-PT commentary exposes 3 clean options
    const workSel = container.querySelector('#export-work') as HTMLSelectElement;
    workSel.value = 'buddhism-in-daily-life';
    workSel.dispatchEvent(new Event('change'));
    const legacyValues = Array.from(langSel.options).map((o) => o.value);
    expect(legacyValues).toEqual(['en', 'pali+pt', 'pt']);
  });

  it('should render all 5 versions cleanly in Reader (renderSegments) and Export (segToHtml) without leaking English into monolingual PT/ES', () => {
    const sampleSeg: Segment = {
      id: 1,
      rend: 'bodytext',
      paranum: null,
      pali: 'Seeing is a dhamma, a reality.',
      en: 'Seeing is a dhamma, a reality.',
      pt: 'O ver é um dhamma, uma realidade.',
      es: 'El ver es un dhamma, una realidad.',
    };

    // 1. Reader: English Original
    const box = document.createElement('div');
    renderSegments([sampleSeg], box, {
      isCommentary: true,
      showPaliOverride: true,
      showTranslationOverride: false,
      effectiveLang: 'en',
    });
    expect(box.querySelector('.seg')?.classList.contains('no-translation')).toBe(true);
    expect(box.querySelector('.seg')?.classList.contains('no-pali')).toBe(false);

    // 2. Reader: Bilingual EN-PT
    renderSegments([sampleSeg], box, {
      isCommentary: true,
      showPaliOverride: true,
      showTranslationOverride: true,
      effectiveLang: 'pt',
    });
    expect(box.querySelector('.seg')?.classList.contains('no-pali')).toBe(false);
    expect(box.querySelector('.translation-line')?.textContent).toContain('O ver é um dhamma, uma realidade.');

    // 3. Reader: Bilingual EN-ES
    renderSegments([sampleSeg], box, {
      isCommentary: true,
      showPaliOverride: true,
      showTranslationOverride: true,
      effectiveLang: 'es',
    });
    expect(box.querySelector('.seg')?.classList.contains('no-pali')).toBe(false);
    expect(box.querySelector('.translation-line')?.textContent).toContain('El ver es un dhamma, una realidad.');

    // 4. Reader: Monolingual PT
    renderSegments([sampleSeg], box, {
      isCommentary: true,
      showPaliOverride: false,
      showTranslationOverride: true,
      effectiveLang: 'pt',
    });
    expect(box.querySelector('.seg')?.classList.contains('no-pali')).toBe(true);
    expect(box.querySelector('.translation-line')?.textContent).toContain('O ver é um dhamma, uma realidade.');

    // 5. Reader: Monolingual ES
    renderSegments([sampleSeg], box, {
      isCommentary: true,
      showPaliOverride: false,
      showTranslationOverride: true,
      effectiveLang: 'es',
    });
    expect(box.querySelector('.seg')?.classList.contains('no-pali')).toBe(true);
    expect(box.querySelector('.translation-line')?.textContent).toContain('El ver es un dhamma, una realidad.');

    // Export segToHtml across all 5 modes (even with a small termsMap containing 'dhamma')
    const smallTermsMap = new Map<string, string>([['dhamma', '0']]);
    const htmlEn = segToHtml(sampleSeg, 'en', smallTermsMap, '');
    expect(htmlEn).toContain('Seeing is');
    expect(htmlEn).not.toContain('O ver é');
    expect(htmlEn).not.toContain('El ver es');

    const htmlEnPt = segToHtml(sampleSeg, 'pali+pt', smallTermsMap, '');
    expect(htmlEnPt).toContain('Seeing is');
    expect(htmlEnPt).toContain('O ver é');
    expect(htmlEnPt).toContain('lang="en"');

    const htmlEnEs = segToHtml(sampleSeg, 'pali+es', smallTermsMap, '');
    expect(htmlEnEs).toContain('Seeing is');
    expect(htmlEnEs).toContain('El ver es');

    const htmlPt = segToHtml(sampleSeg, 'pt', smallTermsMap, '');
    expect(htmlPt).toContain('O ver é');
    expect(htmlPt).not.toContain('Seeing is');

    const htmlEs = segToHtml(sampleSeg, 'es', smallTermsMap, '');
    expect(htmlEs).toContain('El ver es');
    expect(htmlEs).not.toContain('Seeing is');
  });
});
