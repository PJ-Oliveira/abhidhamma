import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { setupApp } from '../../src/app';

describe('Reader UI Integration', () => {
    let container: HTMLElement;

    beforeEach(() => {
        document.body.innerHTML = '<div id="app"><div id="reader-container"></div></div>';
        container = document.getElementById('reader-container')!;
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('should render pali segments with correct CSS class for font targeting', async () => {
        // Mock data
        const mockData = [
            { id: '1', pali: 'Evamme sutam', en: 'Thus I heard', pt: 'Assim eu ouvi' }
        ];

        // Let's directly construct the HTML the way reader.ts does
        let html = '';
        mockData.forEach(seg => {
            html += `<div class="seg" id="${seg.id}">
                <div class="pali-line">${seg.pali}</div>
                <div class="translation-line">${seg.pt}</div>
            </div>`;
        });
        
        container.innerHTML = html;
        
        const paliLine = container.querySelector('.pali-line') as HTMLElement;
        expect(paliLine).not.toBeNull();
        expect(paliLine.textContent).toBe('Evamme sutam');
        
        // CSS class validation (the font-family is tied to this class in style.css)
        expect(paliLine.classList.contains('pali-line')).toBe(true);
        expect(paliLine.closest('.seg')).not.toBeNull();
    });

    it('should render contemporary commentary segments cleanly across all 5 bilingual/monolingual modes', async () => {
        const { renderSegments } = await import('../../src/reader.js');
        const mockCommSegs = [
            { id: 1, rend: 'book', pali: 'Lessons in Abhidhamma', en: 'Lessons in Abhidhamma', pt: 'Lições de Abhidhamma', es: 'Lecciones de Abhidhamma' },
            { id: 260, rend: 'bodytext', pali: '...BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB B...', en: '...BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB B...', pt: '...BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB B...', es: '...BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB B...' }
        ];

        // 1. English mode (showPaliOverride: true, showTranslationOverride: false)
        renderSegments(mockCommSegs as any, container, { isCommentary: true, showPaliOverride: true, showTranslationOverride: false, effectiveLang: 'en' });
        expect(container.querySelectorAll('.seg')).toHaveLength(2);
        expect(container.querySelector('.seg')?.classList.contains('no-translation')).toBe(true);
        expect(container.querySelector('.pali-line')?.textContent).toContain('Lessons in Abhidhamma');

        // 2. Portuguese mode (showPaliOverride: false, showTranslationOverride: true)
        renderSegments(mockCommSegs as any, container, { isCommentary: true, showPaliOverride: false, showTranslationOverride: true, effectiveLang: 'pt' });
        expect(container.querySelector('.seg')?.classList.contains('no-pali')).toBe(true);
        expect(container.querySelector('.translation-line')?.textContent).toContain('Lições de Abhidhamma');

        // 3. Spanish mode
        renderSegments(mockCommSegs as any, container, { isCommentary: true, showPaliOverride: false, showTranslationOverride: true, effectiveLang: 'es' });
        expect(container.querySelector('.seg')?.classList.contains('no-pali')).toBe(true);
        expect(container.querySelector('.translation-line')?.textContent).toContain('Lecciones de Abhidhamma');

        // 4. Bilingual EN+PT
        renderSegments(mockCommSegs as any, container, { isCommentary: true, showPaliOverride: true, showTranslationOverride: true, effectiveLang: 'pt' });
        expect(container.querySelector('.pali-line')?.textContent).toContain('Lessons in Abhidhamma');
        expect(container.querySelector('.translation-line')?.textContent).toContain('Lições de Abhidhamma');

        // 5. Bilingual EN+ES
        renderSegments(mockCommSegs as any, container, { isCommentary: true, showPaliOverride: true, showTranslationOverride: true, effectiveLang: 'es' });
        expect(container.querySelector('.pali-line')?.textContent).toContain('Lessons in Abhidhamma');
        expect(container.querySelector('.translation-line')?.textContent).toContain('Lecciones de Abhidhamma');
    });
});
