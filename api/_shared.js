function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function handleOptions(req, res) {
    if (req.method === 'OPTIONS') {
        setCorsHeaders(res);
        res.status(204).end();
        return true;
    }
    return false;
}

function safeJsonParse(value, fallback = {}) {
    if (!value) return fallback;
    if (typeof value === 'object') return value;
    try {
        return JSON.parse(value);
    } catch {
        return fallback;
    }
}

function pickProvider(requested) {
    const normalized = (requested || 'auto').toLowerCase();
    const openAiReady = Boolean(process.env.OPENAI_API_KEY);
    const geminiReady = Boolean(process.env.GEMINI_API_KEY);

    if (normalized === 'openai') {
        if (!openAiReady) {
            throw new Error('OPENAI_API_KEY is not configured on the server');
        }
        return 'openai';
    }

    if (normalized === 'gemini') {
        if (!geminiReady) {
            throw new Error('GEMINI_API_KEY is not configured on the server');
        }
        return 'gemini';
    }

    if (openAiReady) return 'openai';
    if (geminiReady) return 'gemini';

    throw new Error('No AI provider configured. Add OPENAI_API_KEY or GEMINI_API_KEY on the server.');
}

function ensurePost(req, res) {
    if (req.method !== 'POST') {
        setCorsHeaders(res);
        res.status(405).json({ error: 'Method not allowed' });
        return false;
    }
    return true;
}

module.exports = {
    setCorsHeaders,
    handleOptions,
    safeJsonParse,
    pickProvider,
    ensurePost
};
