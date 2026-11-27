import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { evaluateScenario } from '../../src/ontology/kathavatthu_logic.js';
import { DebateStateMachine, Niggahatthana } from '../../src/ontology/kathavatthu.js';
import { AbhidhammaLogicEngine } from '../../src/ontology/sampayoganaya.js';

const mockCreate = vi.fn();
const mockCreateMLCEngine = vi.fn();

vi.mock('@mlc-ai/web-llm', () => ({
  CreateMLCEngine: (...args: any[]) => mockCreateMLCEngine(...args),
}));

describe('ai-worker.ts (100% coverage)', () => {
  let posted: any[] = [];
  let origPostMessage: any;
  let origOnMessage: any;
  let origGpu: any;

  beforeEach(() => {
    posted = [];
    origPostMessage = (self as any).postMessage;
    origOnMessage = (self as any).onmessage;
    origGpu = (navigator as any).gpu;
    (self as any).postMessage = (msg: any) => {
      posted.push(msg);
    };
    mockCreate.mockReset();
    mockCreateMLCEngine.mockReset();
  });

  afterEach(() => {
    (self as any).postMessage = origPostMessage;
    (self as any).onmessage = origOnMessage;
    if (origGpu === undefined) {
      delete (navigator as any).gpu;
    } else {
      (navigator as any).gpu = origGpu;
    }
    vi.resetModules();
  });

  it('handles INITIALIZE (no WebGPU, success with progress, Error and non-Error), GENERATE, and TOOL_RESULT', async () => {
    await import('../../src/ai-feature/ai-worker.js');
    const handler = (self as any).onmessage as (ev: MessageEvent) => Promise<void>;
    expect(typeof handler).toBe('function');

    // 1. GENERATE and TOOL_RESULT before initialization
    await handler({ data: { type: 'GENERATE', payload: { messages: [] } } } as MessageEvent);
    await handler({ data: { type: 'TOOL_RESULT', payload: { messages: [] } } } as MessageEvent);
    expect(posted.filter((m) => m.type === 'ERROR').length).toBe(2);
    posted = [];

    // 2. INITIALIZE without WebGPU
    delete (navigator as any).gpu;
    await handler({ data: { type: 'INITIALIZE', payload: {} } } as MessageEvent);
    expect(posted[0]).toEqual({
      type: 'ERROR',
      payload: 'WebGPU is not supported on this browser.',
    });
    posted = [];

    // 3. INITIALIZE failure with Error and non-Error
    Object.defineProperty(navigator, 'gpu', { value: {}, configurable: true, writable: true });
    mockCreateMLCEngine.mockRejectedValueOnce(new Error('OOM'));
    await handler({ data: { type: 'INITIALIZE', payload: { model: 'Custom-Model' } } } as MessageEvent);
    expect(posted.some((m) => m.type === 'STATUS')).toBe(true);
    expect(posted.some((m) => m.type === 'ERROR' && m.payload === 'OOM')).toBe(true);
    posted = [];

    mockCreateMLCEngine.mockRejectedValueOnce('string-fail');
    await handler({ data: { type: 'INITIALIZE', payload: undefined } } as MessageEvent);
    expect(posted.some((m) => m.type === 'ERROR' && m.payload === 'string-fail')).toBe(true);
    posted = [];

    // 4. INITIALIZE success invoking initProgressCallback
    mockCreateMLCEngine.mockImplementationOnce(async (_model: string, opts: any) => {
      opts.initProgressCallback({ progress: 0.5, text: 'Loading...' });
      return { chat: { completions: { create: mockCreate } } };
    });
    await handler({ data: { type: 'INITIALIZE', payload: {} } } as MessageEvent);
    expect(posted.some((m) => m.type === 'PROGRESS' && m.payload.progress === 0.5)).toBe(true);
    expect(posted.some((m) => m.type === 'INITIALIZED')).toBe(true);
    posted = [];

    // 5. GENERATE success, Error, non-Error
    mockCreate.mockResolvedValueOnce({ choices: [{ message: { content: 'Dhamma answer' } }] });
    await handler({
      data: { type: 'GENERATE', payload: { messages: [{ role: 'user', content: 'What is citta?' }] } },
    } as MessageEvent);
    expect(posted[0]?.type).toBe('RESULT');
    posted = [];

    mockCreate.mockRejectedValueOnce(new Error('gen-err'));
    await handler({ data: { type: 'GENERATE', payload: { messages: [] } } } as MessageEvent);
    expect(posted[0]).toEqual({ type: 'ERROR', payload: 'gen-err' });
    posted = [];

    mockCreate.mockRejectedValueOnce(42);
    await handler({ data: { type: 'GENERATE', payload: { messages: [] } } } as MessageEvent);
    expect(posted[0]).toEqual({ type: 'ERROR', payload: '42' });
    posted = [];

    // 6. TOOL_RESULT success, Error, non-Error
    mockCreate.mockResolvedValueOnce({ choices: [{ message: { content: 'Tool synthesized' } }] });
    await handler({
      data: { type: 'TOOL_RESULT', payload: { messages: [{ role: 'tool', content: '{}' }] } },
    } as MessageEvent);
    expect(posted[0]?.type).toBe('RESULT');
    posted = [];

    mockCreate.mockRejectedValueOnce(new Error('tool-err'));
    await handler({ data: { type: 'TOOL_RESULT', payload: { messages: [] } } } as MessageEvent);
    expect(posted[0]).toEqual({ type: 'ERROR', payload: 'tool-err' });
    posted = [];

    mockCreate.mockRejectedValueOnce('raw-tool-err');
    await handler({ data: { type: 'TOOL_RESULT', payload: { messages: [] } } } as MessageEvent);
    expect(posted[0]).toEqual({ type: 'ERROR', payload: 'raw-tool-err' });
    posted = [];

    // 7. Unknown message type is ignored gracefully
    await handler({ data: { type: 'PING', payload: {} } } as MessageEvent);
    expect(posted.length).toBe(0);
  });
});

describe('kathavatthu.ts & kathavatthu_logic.ts (100% coverage)', () => {
  it('covers all scenarios across pt, es, and en including vipaka_citta and fallback scenario', () => {
    const scenarios = [
      'puggala_vada',
      'kāla_vada',
      'sassata_vada',
      'ekacca_sassata_vada',
      'amara_vikkhepa_vada',
      'adhicca_samuppanna_vada',
      'vipaka_citta',
      'unknown_scenario_id',
    ];
    for (const id of scenarios) {
      for (const lang of ['pt', 'es', 'en'] as const) {
        const res = evaluateScenario(id, lang);
        expect(res.verdict).toBeTruthy();
        expect(res.history).toBeDefined();
      }
    }
    expect(evaluateScenario('vipaka_citta', 'pt').pedagogicalAnalogy).toContain('Eco');
    expect(evaluateScenario('vipaka_citta', 'es').pedagogicalAnalogy).toContain('Eco');
    expect(evaluateScenario('vipaka_citta', 'en').pedagogicalAnalogy).toContain('Echo');
  });

  it('covers conventionalTruths guard and assertAssociation error paths in DebateStateMachine', () => {
    const spy = vi.spyOn(AbhidhammaLogicEngine, 'isUltimateReality').mockReturnValueOnce(true);
    const dsm = new DebateStateMachine();
    const res = dsm.proposeThesis({ subject: 'Puggala', predicate: 'exists', isUltimate: true });
    expect(res.state).toBe('CONCLUDED_DEFEAT');
    expect(res.defeat).toBe(Niggahatthana.PATINNAYAVIRODHO);
    spy.mockRestore();

    const dsm2 = new DebateStateMachine();
    const spyAssoc = vi.spyOn(AbhidhammaLogicEngine, 'getAssociatedCetasikas').mockImplementationOnce(() => {
      throw new Error('broken');
    });
    const resAssoc = dsm2.assertAssociation('LobhaMula1', 'Phassa');
    expect(resAssoc.valid).toBe(false);
    expect(resAssoc.defeat).toBe(Niggahatthana.ASAMBANDHATTHAM);
    spyAssoc.mockRestore();
  });
});
