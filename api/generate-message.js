const {
    setCorsHeaders,
    handleOptions,
    safeJsonParse,
    pickProvider,
    ensurePost
} = require('./_shared');

function buildPrompt(payload) {
    const hobbies = Array.isArray(payload.selectedHobbies) ? payload.selectedHobbies.join(', ') : '';
    return [
        'Write one personalized greeting card message.',
        `Recipient name: ${payload.recipientName || 'Friend'}`,
        `Event: ${payload.eventDisplayName || payload.eventType || 'Special Occasion'}`,
        `Relationship: ${payload.relationType || 'friend'}`,
        `Tone: ${payload.messageTone || 'balanced'}`,
        `Hobbies/interests: ${hobbies || 'Not specified'}`,
        `User notes: ${payload.userMessage || 'None'}`,
        '',
        'Constraints:',
        '- 40 to 90 words',
        '- Warm, positive, and natural',
        '- No hashtags',
        '- No quotation marks around the full message',
        '- Return only the message text'
    ].join('\n');
}

async function generateWithOpenAI(prompt) {
    const model = process.env.OPENAI_TEXT_MODEL || 'gpt-4.1-mini';
    const response = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model,
            input: prompt,
            temperature: 0.85
        })
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data?.error?.message || 'OpenAI message generation failed');
    }

    const text = (data.output_text || '').trim();
    if (!text) {
        throw new Error('OpenAI returned an empty message');
    }
    return text;
}

async function generateWithGemini(prompt) {
    const model = process.env.GEMINI_TEXT_MODEL || 'gemini-1.5-flash';
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                temperature: 0.85,
                maxOutputTokens: 220
            }
        })
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data?.error?.message || 'Gemini message generation failed');
    }

    const text = data?.candidates?.[0]?.content?.parts?.find(part => typeof part.text === 'string')?.text?.trim();
    if (!text) {
        throw new Error('Gemini returned an empty message');
    }
    return text;
}

module.exports = async (req, res) => {
    if (handleOptions(req, res)) return;
    if (!ensurePost(req, res)) return;

    setCorsHeaders(res);

    try {
        const payload = safeJsonParse(req.body, {});
        if (!payload.recipientName) {
            return res.status(400).json({ error: 'recipientName is required' });
        }

        const provider = pickProvider(payload.provider);
        const prompt = buildPrompt(payload);

        let message;
        if (provider === 'openai') {
            message = await generateWithOpenAI(prompt);
        } else {
            message = await generateWithGemini(prompt);
        }

        res.status(200).json({ message, providerUsed: provider });
    } catch (error) {
        res.status(500).json({ error: error.message || 'Failed to generate message' });
    }
};
