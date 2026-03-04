const {
    setCorsHeaders,
    handleOptions,
    safeJsonParse,
    pickProvider,
    ensurePost
} = require('./_shared');

function buildPrompt(payload) {
    const hobbies = Array.isArray(payload.selectedHobbies) ? payload.selectedHobbies.join(', ') : '';
    const eventType = (payload.eventType || '').toLowerCase();
    const eventGuidance = getEventGuidance(eventType);
    return [
        'Write one personalized greeting card message.',
        `Recipient name: ${payload.recipientName || 'Friend'}`,
        `Event: ${payload.eventDisplayName || payload.eventType || 'Special Occasion'}`,
        `Relationship: ${payload.relationType || 'friend'}`,
        `Tone: ${payload.messageTone || 'balanced'}`,
        `Hobbies/interests: ${hobbies || 'Not specified'}`,
        `User notes: ${payload.userMessage || 'None'}`,
        eventGuidance,
        '',
        'Constraints:',
        '- 40 to 90 words',
        '- Warm, positive, and natural',
        '- No hashtags',
        '- No quotation marks around the full message',
        '- Return only the message text'
    ].join('\n');
}

function getEventGuidance(eventType) {
    const guidanceByFestival = {
        diwali: [
            'Event guidance for Diwali:',
            '- Open naturally with "Happy Diwali"',
            '- Mention light, joy, prosperity, and new beginnings',
            '- Keep it warm, respectful, and family-friendly',
            '- Do not mention other festivals'
        ],
        holi: [
            'Event guidance for Holi:',
            '- Open naturally with "Happy Holi"',
            '- Mention colors, joy, togetherness, and celebration',
            '- Keep it culturally respectful and family-friendly',
            '- Do not mention other festivals'
        ],
        eid: [
            'Event guidance for Eid:',
            '- Open naturally with "Eid Mubarak"',
            '- Mention peace, gratitude, blessings, and togetherness',
            '- Keep wording respectful and family-friendly',
            '- Do not mention other festivals'
        ],
        christmas: [
            'Event guidance for Christmas:',
            '- Open naturally with "Merry Christmas"',
            '- Mention joy, warmth, kindness, and family time',
            '- Keep wording warm and festive',
            '- Do not mention other festivals'
        ],
        newyear: [
            'Event guidance for New Year:',
            '- Open naturally with "Happy New Year"',
            '- Mention fresh beginnings, hope, and success ahead',
            '- Keep it positive and forward-looking',
            '- Do not mention other festivals'
        ],
        navratri: [
            'Event guidance for Navratri:',
            '- Open naturally with "Happy Navratri"',
            '- Mention devotion, celebration, and positive energy',
            '- Keep wording respectful and uplifting',
            '- Do not mention other festivals'
        ],
        dussehra: [
            'Event guidance for Dussehra:',
            '- Open naturally with "Happy Dussehra"',
            '- Mention victory of good, courage, and new beginnings',
            '- Keep wording respectful and optimistic',
            '- Do not mention other festivals'
        ],
        ganeshchaturthi: [
            'Event guidance for Ganesh Chaturthi:',
            '- Open naturally with "Happy Ganesh Chaturthi"',
            '- Mention blessings, wisdom, and prosperity',
            '- Keep wording devotional and respectful',
            '- Do not mention other festivals'
        ],
        rakshabandhan: [
            'Event guidance for Raksha Bandhan:',
            '- Open naturally with "Happy Raksha Bandhan"',
            '- Mention sibling bond, love, trust, and support',
            '- Keep wording warm and family-oriented',
            '- Do not mention other festivals'
        ],
        janmashtami: [
            'Event guidance for Janmashtami:',
            '- Open naturally with "Happy Janmashtami"',
            '- Mention devotion, peace, and divine blessings',
            '- Keep wording respectful and serene',
            '- Do not mention other festivals'
        ],
        onam: [
            'Event guidance for Onam:',
            '- Open naturally with "Happy Onam"',
            '- Mention abundance, joy, and family togetherness',
            '- Keep wording warm and celebratory',
            '- Do not mention other festivals'
        ],
        pongal: [
            'Event guidance for Pongal:',
            '- Open naturally with "Happy Pongal"',
            '- Mention harvest joy, gratitude, and prosperity',
            '- Keep wording warm and family-friendly',
            '- Do not mention other festivals'
        ],
        lohri: [
            'Event guidance for Lohri:',
            '- Open naturally with "Happy Lohri"',
            '- Mention warmth, celebration, and festive joy',
            '- Keep wording cheerful and respectful',
            '- Do not mention other festivals'
        ]
    };

    return guidanceByFestival[eventType]?.join('\n') || '';
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
