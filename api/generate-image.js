const {
    setCorsHeaders,
    handleOptions,
    safeJsonParse,
    pickProvider,
    ensurePost
} = require('./_shared');

function buildImagePrompt(payload) {
    const eventName = payload.eventDisplayName || payload.eventType || 'special occasion';
    const hobbies = Array.isArray(payload.selectedHobbies) ? payload.selectedHobbies.join(', ') : '';

    return [
        `Create a greeting card style illustration for ${eventName}.`,
        `Theme details: ${payload.designPreference || 'colorful, modern, warm and joyful'}.`,
        `Recipient focus: ${payload.recipientName || 'friend'}.`,
        `Interests to hint at: ${hobbies || 'none'}.`,
        'Style constraints:',
        '- No readable text or letters in the image',
        '- Bright premium digital card style',
        '- 1:1 square composition',
        '- Safe-for-work and family-friendly'
    ].join('\n');
}

async function generateOpenAIImage(prompt) {
    const model = process.env.OPENAI_IMAGE_MODEL || 'gpt-image-1';

    const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model,
            prompt,
            size: '1024x1024'
        })
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data?.error?.message || 'OpenAI image generation failed');
    }

    const imageBase64 = data?.data?.[0]?.b64_json;
    if (!imageBase64) {
        throw new Error('OpenAI did not return image data');
    }

    return `data:image/png;base64,${imageBase64}`;
}

async function generateGeminiImage(prompt) {
    const model = process.env.GEMINI_IMAGE_MODEL || 'gemini-2.0-flash-preview-image-generation';
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
                responseModalities: ['IMAGE', 'TEXT']
            }
        })
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error(data?.error?.message || 'Gemini image generation failed');
    }

    const parts = data?.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find(part => part.inlineData?.data);
    if (!imagePart?.inlineData?.data) {
        throw new Error('Gemini did not return image data');
    }

    const mimeType = imagePart.inlineData.mimeType || 'image/png';
    return `data:${mimeType};base64,${imagePart.inlineData.data}`;
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
        const prompt = buildImagePrompt(payload);

        let imageDataUrl;
        if (provider === 'openai') {
            imageDataUrl = await generateOpenAIImage(prompt);
        } else {
            imageDataUrl = await generateGeminiImage(prompt);
        }

        res.status(200).json({ imageDataUrl, providerUsed: provider });
    } catch (error) {
        res.status(500).json({ error: error.message || 'Failed to generate image' });
    }
};
