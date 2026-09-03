import { t } from '../i18n.js';
import { settings } from '../state.js';
import { CanonicalScenarios } from './debate-scenarios.js';
import { evaluateScenario } from '../ontology/kathavatthu_logic.js';
export function initInterlocutorPanel(container) {
    const wrapper = document.createElement('div');
    wrapper.className = 'interlocutor-panel';
    wrapper.style.display = 'flex';
    wrapper.style.flexDirection = 'column';
    wrapper.style.gap = '12px';
    wrapper.style.padding = '16px';
    wrapper.style.border = '1px solid var(--border, #d9c3a6)';
    wrapper.style.borderRadius = '8px';
    wrapper.style.backgroundColor = 'var(--bg-panel, #f5ece0)';
    wrapper.style.color = 'var(--text, #33261a)';
    wrapper.style.boxSizing = 'border-box';
    wrapper.innerHTML = `
        <h2 style="margin-top: 0; margin-bottom: 8px;">${t('debate_title', settings.uiLang)}</h2>
        <p style="margin: 0; font-size: 0.9em; color: var(--text-muted, #6f5c48);">
            ${t('debate_subtitle', settings.uiLang)}
        </p>
        
        <label for="scenario-select" style="font-weight: bold; margin-top: 8px;">${t('debate_select_label', settings.uiLang)}</label>
        <select id="scenario-select" style="box-sizing: border-box; padding: 8px; border-radius: 4px; border: 1px solid var(--border, #d9c3a6); width: 100%; background: var(--bg-content, #f8f0e5); color: var(--text, #33261a);">
            <option value="" disabled selected>${t('debate_select_default', settings.uiLang)}</option>
            ${CanonicalScenarios.map(s => '<option value="' + s.id + '">' + s.source + ': ' + s.title[settings.uiLang] + '</option>').join('')}

        </select>

        <div id="claim-display" style="display: none; padding: 12px; background-color: var(--accent-soft, #e6cead); border-left: 4px solid var(--accent, #b3663f); border-radius: 4px;">
            <p id="claim-text" style="margin: 0; font-style: italic; color: var(--text, #33261a);"></p>
        </div>

        

        <button id="interlocutor-submit" style="padding: 10px 16px; background-color: var(--accent, #b3663f); color: #fff; border: none; border-radius: 4px; cursor: pointer; align-self: flex-start; font-weight: bold;" disabled>
            ${t('debate_submit', settings.uiLang)}
        </button>

        <div id="refutation-display" style="display: none; margin-top: 16px; border: 1px solid var(--border, #d9c3a6); border-radius: 8px; overflow: hidden; font-family: system-ui, sans-serif;">
            <!-- DEFEAT HEADER -->
            <div style="background-color: #8c2a2a; color: #fdf6e3; padding: 14px 16px; border-bottom: 2px solid #5a1919;">
                <div style="font-size: 0.8em; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.9; margin-bottom: 4px;">${t('debate_defeat_title', settings.uiLang)}</div>
                <div id="refutation-verdict" style="font-size: 1.2em; font-weight: bold;">Paṭiññāvirodho (Contradicting the Proposition)</div>
            </div>
            
            <div style="padding: 20px; background-color: var(--bg, #ecdcc9); color: var(--text, #33261a); display: flex; flex-direction: column; gap: 16px;">
                
                <!-- LOGICAL CONTEXT -->
                <div style="background: var(--bg-content, #f8f0e5); padding: 12px; border-left: 4px solid var(--text, #33261a); box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <h4 style="margin: 0 0 8px 0; color: var(--text, #33261a); font-size: 0.9em; text-transform: uppercase;">${t('debate_logical_context', settings.uiLang)}</h4>
                    <p id="refutation-history" style="margin: 0; font-size: 0.95em; line-height: 1.5;"></p>
                </div>

                <!-- META-LOGIC (EPISTEMOLOGY) -->
                <div style="background: var(--bg-content, #f8f0e5); padding: 12px; border-left: 4px solid #6b4c9a; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <h4 style="margin: 0 0 8px 0; color: #6b4c9a; font-size: 0.9em; text-transform: uppercase;">${t('debate_epistemology', settings.uiLang)}</h4>
                    <p id="refutation-metalogic" style="margin: 0; font-size: 0.95em; line-height: 1.5; font-weight: 500;"></p>
                </div>

                <!-- REDUCTIO AD ABSURDUM -->
                <div style="background: var(--bg-content, #f8f0e5); padding: 12px; border-left: 4px solid #b34d4d; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <h4 style="margin: 0 0 8px 0; color: #b34d4d; font-size: 0.9em; text-transform: uppercase;">Āpādanā (${t('debate_paradox_header', settings.uiLang)})</h4>
                    <p id="refutation-paradox" style="margin: 0; font-size: 0.95em; line-height: 1.5;"></p>
                </div>

                <!-- SYLLOGISM -->
                <div style="background: var(--bg-content, #f8f0e5); padding: 12px; border-left: 4px solid var(--translation-bar, #5a7a5f); box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                    <h4 style="margin: 0 0 8px 0; color: var(--translation-bar, #5a7a5f); font-size: 0.9em; text-transform: uppercase;">Porāṇena Ñāyakkamena (${t('debate_formal_syllogism', settings.uiLang)} / Anuṭīkā)</h4>
                    <div id="refutation-logic" style="margin: 0; font-size: 0.9em; line-height: 1.6; font-family: monospace; background: var(--bg-panel, #f5ece0); padding: 10px; border-radius: 4px;"></div>
                </div>
                
                <button id="btn-elaborate" style="margin-top: 8px; padding: 8px 12px; background-color: var(--text-muted, #6f5c48); color: #fff; border: none; border-radius: 4px; cursor: pointer; align-self: flex-start; font-size: 0.9em; font-weight: bold;">
                    🤔 ${t('debate_elaborate_logic', settings.uiLang)}
                </button>

                <!-- PEDAGOGICAL EXPANSION (Hidden by default) -->
                <div id="pedagogical-display" style="display: none; background: var(--accent-soft, #e6cead); padding: 16px; border: 1px solid var(--accent, #b3663f); border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
                    <h4 style="margin: 0 0 12px 0; color: var(--text, #33261a); font-size: 1em; display: flex; align-items: center; gap: 8px;">
                        <span>📖</span> Abhidhammika Exegesis (${t('debate_pedagogical_breakdown', settings.uiLang)})
                    </h4>
                    <h5 style="margin: 0 0 4px 0; color: var(--accent, #b3663f); font-size: 0.9em;">${t('debate_classical_analogy', settings.uiLang)}:</h5>
                    <p id="pedagogical-analogy" style="margin: 0 0 12px 0; font-size: 0.95em; line-height: 1.5; color: var(--text, #33261a);"></p>
                    
                    <h5 style="margin: 0 0 4px 0; color: var(--accent, #b3663f); font-size: 0.9em;">${t('debate_dissecting', settings.uiLang)}:</h5>
                    <p id="pedagogical-breakdown" style="margin: 0; font-size: 0.95em; line-height: 1.5; color: var(--text, #33261a);"></p>
                </div>

            </div>
        </div>
    `;
    container.appendChild(wrapper);
    const select = wrapper.querySelector('#scenario-select');
    const claimDisplay = wrapper.querySelector('#claim-display');
    const claimText = wrapper.querySelector('#claim-text');
    const submitBtn = wrapper.querySelector('#interlocutor-submit');
    const elaborateBtn = wrapper.querySelector('#btn-elaborate');
    const pedagogicalDisplay = wrapper.querySelector('#pedagogical-display');
    elaborateBtn.addEventListener('click', () => {
        pedagogicalDisplay.style.display = 'block';
        elaborateBtn.style.display = 'none';
    });
    select.addEventListener('change', () => {
        const val = select.value;
        if (val) {
            const scenario = CanonicalScenarios.find(s => s.id === val);
            if (scenario) {
                claimText.textContent = '"' + scenario.claimText[settings.uiLang] + '"';
                claimDisplay.style.display = 'block';
                submitBtn.disabled = false;
            }
        }
        else {
            claimDisplay.style.display = 'none';
            submitBtn.disabled = true;
        }
        wrapper.querySelector('#refutation-display').style.display = 'none';
        pedagogicalDisplay.style.display = 'none';
        elaborateBtn.style.display = 'inline-block';
    });
    submitBtn.addEventListener('click', () => {
        const val = select.value;
        let claim = '';
        const scenario = CanonicalScenarios.find(s => s.id === val);
        if (scenario) {
            claim = scenario.claimText[settings.uiLang];
        }
        if (claim) {
            wrapper.dispatchEvent(new CustomEvent('interlocutor-submit', {
                detail: { claim, scenarioId: val },
                bubbles: true
            }));
            const origText = submitBtn.textContent;
            submitBtn.textContent = 'Analyzing Logic...';
            submitBtn.disabled = true;
            setTimeout(() => {
                submitBtn.textContent = origText;
                submitBtn.disabled = false;
                const refutationDisplay = wrapper.querySelector('#refutation-display');
                const verdictEl = wrapper.querySelector('#refutation-verdict');
                const historyEl = wrapper.querySelector('#refutation-history');
                const metaLogicEl = wrapper.querySelector('#refutation-metalogic');
                const paradoxEl = wrapper.querySelector('#refutation-paradox');
                const logicEl = wrapper.querySelector('#refutation-logic');
                const pedaAnalogyEl = wrapper.querySelector('#pedagogical-analogy');
                const pedaBreakdownEl = wrapper.querySelector('#pedagogical-breakdown');
                const evaluation = evaluateScenario(val, settings.uiLang);
                verdictEl.textContent = evaluation.verdict;
                historyEl.innerHTML = evaluation.history;
                metaLogicEl.innerHTML = evaluation.metaLogic;
                paradoxEl.innerHTML = evaluation.paradox;
                logicEl.innerHTML = evaluation.logic;
                pedaAnalogyEl.textContent = evaluation.pedagogicalAnalogy;
                pedaBreakdownEl.textContent = evaluation.detailedSyllogismBreakdown;
                refutationDisplay.style.display = 'block';
                pedagogicalDisplay.style.display = 'none';
                elaborateBtn.style.display = 'inline-block';
            }, 1000);
        }
    });
}
//# sourceMappingURL=ui.js.map