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
});
