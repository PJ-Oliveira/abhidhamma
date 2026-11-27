import { describe, it, expect, vi } from 'vitest';
import { initInterlocutorPanel } from '../../src/ai-feature/ui.js';
import { settings } from '../../src/state.js';

describe('AI Feature UI', () => {
    it('should initialize and render panel', () => {
        const container = document.createElement('div');
        initInterlocutorPanel(container);
        
        expect(container.innerHTML).toContain('Canonical Debate Simulator');
        
        // Test interactions
        const select = container.querySelector('#scenario-select') as HTMLSelectElement;
        const customContainer = container.querySelector('#custom-container') as HTMLElement;
        const claimDisplay = container.querySelector('#claim-display') as HTMLElement;
        const submitBtn = container.querySelector('#interlocutor-submit') as HTMLButtonElement;
        
        
        
        // Scenario selection
        select.value = 'puggala_vada';
        select.dispatchEvent(new Event('change'));
        expect(claimDisplay.style.display).toBe('block');
        
        // Submit
        vi.useFakeTimers();
        submitBtn.click();
        vi.runAllTimers();
        vi.useRealTimers();
        
        const verdictEl = container.querySelector('#refutation-verdict') as HTMLElement;
        expect(verdictEl.textContent).toContain('Paṭiññāvirodho');
    });

    it('renders Debate UI fully localized in PT and ES without hardcoded English labels', () => {
        const origLang = settings.uiLang;
        try {
            for (const [lang, expectedExegesis, expectedVerdict] of [
                ['pt', 'Exegese Abhidhammika', 'Contradição à Proposição'],
                ['es', 'Exégesis Abhidhammika', 'Contradicción de la Proposición'],
            ] as const) {
                settings.uiLang = lang;
                const container = document.createElement('div');
                initInterlocutorPanel(container);
                expect(container.innerHTML).toContain(expectedExegesis);
                expect(container.innerHTML).not.toContain('Abhidhammika Exegesis');

                const select = container.querySelector('#scenario-select') as HTMLSelectElement;
                const submitBtn = container.querySelector('#interlocutor-submit') as HTMLButtonElement;
                select.value = 'puggala_vada';
                select.dispatchEvent(new Event('change'));

                vi.useFakeTimers();
                submitBtn.click();
                expect(submitBtn.textContent).not.toContain('Analyzing Logic');
                vi.runAllTimers();
                vi.useRealTimers();

                const verdictEl = container.querySelector('#refutation-verdict') as HTMLElement;
                expect(verdictEl.textContent).toContain(expectedVerdict);
            }
        } finally {
            settings.uiLang = origLang;
        }
    });

    it('cancels pending refutation timer when scenario changes and updates current active container on languageChanged', () => {
        const origLang = settings.uiLang;
        try {
            settings.uiLang = 'en';
            const container = document.createElement('div');
            initInterlocutorPanel(container);

            const select = container.querySelector('#scenario-select') as HTMLSelectElement;
            const submitBtn = container.querySelector('#interlocutor-submit') as HTMLButtonElement;
            select.value = 'puggala_vada';
            select.dispatchEvent(new Event('change'));

            vi.useFakeTimers();
            submitBtn.click();
            // Switch scenario before 1000ms elapses
            select.value = 'sassata_vada';
            select.dispatchEvent(new Event('change'));
            vi.runAllTimers();
            vi.useRealTimers();

            const refDisplay = container.querySelector('#refutation-display') as HTMLElement;
            expect(refDisplay.style.display).toBe('none');

            // Dispatch languageChanged -> must re-render current active container
            settings.uiLang = 'pt';
            window.dispatchEvent(new Event('languageChanged'));
            expect(container.innerHTML).toContain('Exegese Abhidhammika');
        } finally {
            settings.uiLang = origLang;
        }
    });
});
