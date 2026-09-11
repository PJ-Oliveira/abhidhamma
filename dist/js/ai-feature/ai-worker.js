import { CreateMLCEngine } from '@mlc-ai/web-llm';
const ontologyTools = [
    {
        type: "function",
        function: {
            name: "query_dhamma_ontology",
            description: "Queries the deterministic Dhamma ontology for exact definitions, relationships, and classifications of concepts.",
            parameters: {
                type: "object",
                properties: {
                    concept: {
                        type: "string",
                        description: "The Dhamma concept to query (e.g., 'citta', 'cetasika', 'rupa', 'nibbana')."
                    },
                    query_type: {
                        type: "string",
                        enum: ["definition", "classification", "relationships", "characteristics"],
                        description: "The type of information to retrieve about the concept."
                    },
                    language: {
                        type: "string",
                        enum: ["pali", "english", "portuguese"],
                        description: "The language of the query concept."
                    }
                },
                required: ["concept", "query_type"]
            }
        }
    },
    {
        type: "function",
        function: {
            name: "get_sutta_reference",
            description: "Retrieves specific references from the Abhidhamma Pitaka or Sutta Pitaka related to a topic.",
            parameters: {
                type: "object",
                properties: {
                    topic: {
                        type: "string",
                        description: "The topic or keyword to find references for."
                    }
                },
                required: ["topic"]
            }
        }
    }
];
const SYSTEM_PROMPT = `
You are a highly specialized Natural Language Understanding (NLU) and Natural Language Generation (NLG) bridge interface for an Abhidhamma deterministic ontology.
Your ONLY purpose is to translate user queries into structured tool calls to the ontology, and to translate the deterministic responses back into natural language.

CRITICAL INSTRUCTIONS:
1. YOU MUST NEVER ANSWER DHAMMA QUESTIONS FROM YOUR OWN INTERNAL KNOWLEDGE.
2. Every user question regarding Dhamma MUST be routed through the provided tools.
3. If the user asks a question, use the appropriate tool (e.g., 'query_dhamma_ontology' or 'get_sutta_reference') to fetch the answer.
4. When you receive the tool's output, present it to the user clearly, accurately, and without adding your own interpretations or opinions.
5. If the tools return no information, state that the information is not available in the ontology. Do NOT guess or hallucinate an answer.
6. Maintain a respectful, objective, and scholarly tone appropriate for the Abhidhamma.
`;
let engine = null;
self.onmessage = async (event) => {
    const { type, payload } = event.data;
    if (type === 'INITIALIZE') {
        if (!navigator.gpu) {
            self.postMessage({ type: 'ERROR', payload: 'WebGPU is not supported on this browser.' });
            return;
        }
        try {
            const initProgressCallback = (initProgress) => {
                self.postMessage({ type: 'PROGRESS', payload: initProgress });
            };
            const selectedModel = payload?.model || "Llama-3-8B-Instruct-q4f32_1-MLC";
            self.postMessage({ type: 'STATUS', payload: 'Initializing engine...' });
            engine = await CreateMLCEngine(selectedModel, {
                initProgressCallback,
            });
            self.postMessage({ type: 'INITIALIZED' });
        }
        catch (error) {
            self.postMessage({ type: 'ERROR', payload: error instanceof Error ? error.message : String(error) });
        }
    }
    else if (type === 'GENERATE') {
        if (!engine) {
            self.postMessage({ type: 'ERROR', payload: 'Engine not initialized. Please initialize first.' });
            return;
        }
        try {
            const messages = [
                { role: 'system', content: SYSTEM_PROMPT },
                ...payload.messages
            ];
            const reply = await engine.chat.completions.create({
                messages,
                tools: ontologyTools,
            });
            self.postMessage({ type: 'RESULT', payload: reply });
        }
        catch (error) {
            self.postMessage({ type: 'ERROR', payload: error instanceof Error ? error.message : String(error) });
        }
    }
    else if (type === 'TOOL_RESULT') {
        if (!engine) {
            self.postMessage({ type: 'ERROR', payload: 'Engine not initialized. Please initialize first.' });
            return;
        }
        try {
            const messages = [
                { role: 'system', content: SYSTEM_PROMPT },
                ...payload.messages
            ];
            const reply = await engine.chat.completions.create({
                messages,
                tools: ontologyTools,
            });
            self.postMessage({ type: 'RESULT', payload: reply });
        }
        catch (error) {
            self.postMessage({ type: 'ERROR', payload: error instanceof Error ? error.message : String(error) });
        }
    }
};
//# sourceMappingURL=ai-worker.js.map