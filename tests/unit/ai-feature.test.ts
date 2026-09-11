import { describe, it, expect, vi } from 'vitest';
import { initInterlocutorPanel } from '../../src/ai-feature/ui.js';

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
});
