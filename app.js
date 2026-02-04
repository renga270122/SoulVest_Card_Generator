// State management
const state = {
    recipientName: '',
    eventType: '',
    selectedHobbies: [],
    userMessage: '',
    designPreference: '',
    photoFile: null,
    generatedMessage: '',
    apiKey: localStorage.getItem('gemini_api_key') || ''
};

// Hobby options by event
const hobbyOptions = {
    birthday: ['Reading', 'Gaming', 'Sports', 'Music', 'Cooking', 'Travel', 'Art', 'Photography', 'Fitness', 'Movies', 'Painting', 'Dancing', 'Yoga', 'Hiking', 'Swimming', 'Gardening', 'Crafts', 'Writing', 'Singing', 'Cycling'],
    anniversary: ['Cooking', 'Travel', 'Music', 'Art', 'Wine Tasting', 'Dancing', 'Gardening', 'Hiking', 'Spa & Wellness', 'Movies', 'Romantic Dinners', 'Photography', 'Beach Walks', 'Painting', 'Yoga', 'Meditation', 'Concerts', 'Singing', 'Museums', 'Book Clubs'],
    wedding: ['Travel', 'Cooking', 'Gardening', 'Wine', 'Art', 'Music', 'Fitness', 'Photography', 'Hiking', 'Spa', 'Beach', 'Camping', 'Yoga', 'Volunteering', 'Dancing', 'Theater', 'Singing', 'Sports', 'Reading', 'Adventure'],
    graduation: ['Career Growth', 'Travel', 'Reading', 'Technology', 'Sports', 'Art', 'Music', 'Volunteering', 'Networking', 'Adventure', 'Entrepreneurship', 'Leadership', 'Innovation', 'Mentoring', 'Writing', 'Photography', 'Public Speaking', 'Coding', 'Research', 'Teaching'],
    newjob: ['Career Growth', 'Reading', 'Technology', 'Networking', 'Fitness', 'Work-Life Balance', 'Leadership', 'Innovation', 'Team Building', 'Professional Development', 'Mentoring', 'Public Speaking', 'Project Management', 'Coding', 'Analysis', 'Communication', 'Creativity', 'Strategy', 'Collaboration', 'Continuous Learning'],
    housewarming: ['Gardening', 'Cooking', 'Interior Design', 'DIY', 'Entertaining', 'Art', 'Music', 'Fitness', 'Technology', 'Plants', 'Landscaping', 'Home Decor', 'Hosting', 'Renovation', 'Painting', 'Woodworking', 'Architecture', 'Photography', 'Smart Home', 'Organization'],
    promotion: ['Career Growth', 'Leadership', 'Technology', 'Networking', 'Professional Development', 'Reading', 'Mentoring', 'Innovation', 'Public Speaking', 'Strategy', 'Management', 'Coaching', 'Analysis', 'Decision Making', 'Team Building', 'Communication', 'Project Management', 'Continuous Learning', 'Negotiation', 'Vision Setting'],
    retirement: ['Travel', 'Gardening', 'Reading', 'Cooking', 'Hobby Crafts', 'Hiking', 'Volunteer Work', 'Grandchildren', 'Photography', 'Relaxation', 'Painting', 'Writing', 'Golf', 'Fishing', 'Yoga', 'Meditation', 'Woodworking', 'Birdwatching', 'Museums', 'Beach Time'],
    babyshower: ['Parenting', 'Childcare', 'Family', 'Nursery Design', 'Reading', 'Crafting', 'Photography', 'Gift Giving', 'Cooking', 'Community', 'Baby Products', 'Child Development', 'Storytelling', 'Music for Kids', 'Singing', 'Art & Crafts', 'Organization', 'Time Management', 'Bonding', 'Learning Together'],
    getwell: ['Reading', 'Movies', 'Music', 'Meditation', 'Cooking', 'Art', 'Nature', 'Relaxation', 'Journaling', 'Positive Thinking', 'Yoga', 'Gardening', 'Photography', 'Audio Books', 'Singing', 'Gentle Sports', 'Tea Time', 'Painting', 'Writing', 'Walks']
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateHobbies();
    if (state.apiKey) {
        document.getElementById('apiConfigModal').innerHTML = document.getElementById('apiConfigModal').innerHTML;
    }
});

// API Key Management
function showAPIConfig() {
    document.getElementById('apiConfigModal').classList.add('show');
    document.getElementById('apiKeyInput').value = state.apiKey;
}

function closeAPIConfig() {
    document.getElementById('apiConfigModal').classList.remove('show');
}

function saveAPIKey() {
    const key = document.getElementById('apiKeyInput').value.trim();
    if (!key) {
        showStatus('Please enter an API key', 'error');
        return;
    }
    localStorage.setItem('gemini_api_key', key);
    state.apiKey = key;
    showStatus('API Key saved successfully!', 'success');
    setTimeout(() => closeAPIConfig(), 1500);
}

function testAPIKey() {
    if (!state.apiKey) {
        alert('Please configure your API key first');
        return;
    }
    
    showMessage('Testing API connection...', 'loading');
    console.log('Testing API with key:', state.apiKey.substring(0, 10) + '...');
    
    const url = 'https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=' + state.apiKey;
    console.log('Request URL:', url);
    
    const testRequest = {
        contents: [{
            parts: [{ text: 'Say hello' }]
        }]
    };
    
    console.log('Request body:', JSON.stringify(testRequest));
    
    fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testRequest)
    })
    .then(response => {
        console.log('Response received - Status:', response.status);
        console.log('Response OK:', response.ok);
        
        if (!response.ok) {
            return response.text().then(text => {
                console.error('Error response body:', text);
                try {
                    const err = JSON.parse(text);
                    throw new Error(`API Error ${response.status}: ${err.error?.message || text}`);\n                } catch (e) {
                    throw new Error(`API Error ${response.status}: ${text || response.statusText}`);\n                }
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('API Response:', data);
        showMessage('✅ API Connection Successful!', 'success');
    })
    .catch(error => {
        console.error('Full error:', error);
        console.error('Error message:', error.message);
        let message = error.message;
        if (message.includes('Failed to fetch')) {
            message = 'Network/CORS Error. Check browser console (F12) for details. Your key may need to be added to allowed origins or the API might have restrictions.';\n        }
        showMessage(`❌ API Test Failed: ${message}`, 'error');
    });
}

function showStatus(message, type) {
    const statusEl = document.getElementById('apiKeyStatus');
    statusEl.className = type === 'error' ? 'error-message' : 'success-message';
    statusEl.textContent = message;
}

// Hobby management
function updateHobbies() {
    const eventType = document.getElementById('eventType').value;
    state.eventType = eventType;
    
    const container = document.getElementById('hobbiesContainer');
    const anniversaryGroup = document.getElementById('anniversaryYearGroup');
    
    // Show/hide anniversary year field
    if (eventType === 'anniversary') {
        anniversaryGroup.classList.remove('hidden');
    } else {
        anniversaryGroup.classList.add('hidden');
    }
    
    container.innerHTML = '';
    
    if (!eventType) {
        container.innerHTML = '<p style="color: #999;">Select an event first</p>';
        return;
    }
    
    const hobbies = hobbyOptions[eventType] || [];
    hobbies.forEach(hobby => {
        const label = document.createElement('label');
        label.className = 'checkbox-item';
        label.innerHTML = `
            <input type="checkbox" value="${hobby}" onchange="updateSelectedHobbies()">
            <span>${hobby}</span>
        `;
        container.appendChild(label);
    });
}

function updateSelectedHobbies() {
    const checkboxes = document.querySelectorAll('#hobbiesContainer input[type="checkbox"]:checked');
    state.selectedHobbies = Array.from(checkboxes).map(cb => cb.value);
}

// Speech to text
function startSpeechToText() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        alert('Speech recognition not supported in this browser');
        return;
    }
    
    const recognition = new SpeechRecognition();
    const button = event.target;
    button.classList.add('recording');
    button.textContent = '🎤 Listening...';
    
    recognition.onstart = () => {
        button.classList.add('recording');
    };
    
    recognition.onend = () => {
        button.classList.remove('recording');
        button.textContent = '🎤 Speak Message';
    };
    
    recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
        }
        document.getElementById('userMessage').value += ' ' + transcript;
    };
    
    recognition.start();
}

// Card generation
async function generateCard() {
    // Validate inputs
    state.recipientName = document.getElementById('recipientName').value.trim();
    state.userMessage = document.getElementById('userMessage').value.trim();
    state.designPreference = document.getElementById('designPreference').value.trim();
    
    if (!state.recipientName) {
        showMessage('Please enter recipient name', 'error');
        return;
    }
    
    if (!state.eventType) {
        showMessage('Please select an event type', 'error');
        return;
    }
    
    if (state.eventType === 'anniversary') {
        const yearsTogether = document.getElementById('yearsTogether').value.trim();
        if (!yearsTogether) {
            showMessage('Please enter years together for anniversary', 'error');
            return;
        }
        state.yearsTogether = yearsTogether;
    }
    
    if (!state.apiKey) {
        showMessage('Please configure your API key first', 'error');
        return;
    }
    
    showMessage('Generating card...', 'loading');
    
    try {
        // Generate message if not provided
        if (!state.userMessage) {
            await generateMessage();
        } else {
            state.generatedMessage = state.userMessage;
        }
        
        // Render card
        renderCard();
        showMessage('Card generated successfully!', 'success');
        document.getElementById('exportButtons').classList.remove('hidden');
    } catch (error) {
        console.error('Error:', error);
        showMessage(error.message || 'Error generating card', 'error');
    }
}

async function generateMessage() {
    const hobbiesText = state.selectedHobbies.length > 0 
        ? `Their hobbies/interests: ${state.selectedHobbies.join(', ')}`
        : '';
    
    let prompt = `Create a warm, heartfelt ${state.eventType} message for ${state.recipientName}. 
${hobbiesText}`;
    
    if (state.eventType === 'anniversary' && state.yearsTogether) {
        prompt += `\nYears together: ${state.yearsTogether} years`;
    }
    
    prompt += `\nKeep it to 2-3 sentences, personal and touching. Make it suitable for a gift card.`;
    
    try {
        const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=' + state.apiKey, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            })
        });
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            if (response.status === 401) {
                throw new Error('Invalid API key. Please check and try again.');
            }
            if (response.status === 429) {
                throw new Error('API rate limit exceeded. Please wait a moment and try again.');
            }
            throw new Error(errorData.error?.message || `API Error: ${response.status}`);
        }
        
        const data = await response.json();
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts) {
            throw new Error('Unexpected API response format');
        }
        state.generatedMessage = data.candidates[0].content.parts[0].text;
    } catch (error) {
        if (error.message.includes('Failed to fetch')) {
            throw new Error('CORS/Network Error: The browser blocked the API request. This typically means:\n- Your API key has CORS restrictions\n- The request origin is not whitelisted\n\nOpen browser console (F12) to see details. Check your Google Cloud Console API settings.');
        }
        throw new Error('Failed to generate message: ' + error.message);
    }
}

function renderCard() {
    const designTheme = parseDesignPreference(state.designPreference);
    const cardPreview = document.getElementById('cardPreview');
    
    // Apply design theme
    cardPreview.style.background = designTheme.gradient;
    
    cardPreview.innerHTML = `
        <div class="card-header">
            <h2>${designTheme.emoji} ${state.eventType.charAt(0).toUpperCase() + state.eventType.slice(1)}</h2>
            <p style="font-size: 1.2em; margin-top: 10px;">For ${state.recipientName}</p>
        </div>
        <div class="card-body">
            <div class="card-message">${state.generatedMessage}</div>
        </div>
        <div class="card-footer">
            <p>${designTheme.tagline}</p>
        </div>
    `;
    
    // Save for export
    window.cardHTML = cardPreview.innerHTML;
}

function parseDesignPreference(text) {
    const themes = {
        elegant: {
            gradient: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
            emoji: '✨',
            tagline: 'Elegant & Refined'
        },
        colorful: {
            gradient: 'linear-gradient(135deg, #e74c3c 0%, #f39c12 50%, #27ae60 100%)',
            emoji: '🌈',
            tagline: 'Vibrant & Joyful'
        },
        minimalist: {
            gradient: 'linear-gradient(135deg, #ecf0f1 0%, #bdc3c7 100%)',
            emoji: '⚪',
            tagline: 'Simple & Pure'
        },
        romantic: {
            gradient: 'linear-gradient(135deg, #e91e63 0%, #ff6090 100%)',
            emoji: '💕',
            tagline: 'Romantic & Sweet'
        },
        nature: {
            gradient: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)',
            emoji: '🌿',
            tagline: 'Fresh & Natural'
        },
        professional: {
            gradient: 'linear-gradient(135deg, #2980b9 0%, #3498db 100%)',
            emoji: '💼',
            tagline: 'Professional & Strong'
        },
        fun: {
            gradient: 'linear-gradient(135deg, #f39c12 0%, #ff6b6b 100%)',
            emoji: '🎉',
            tagline: 'Fun & Playful'
        },
        night: {
            gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            emoji: '🌙',
            tagline: 'Dark & Mysterious'
        }
    };
    
    const textLower = text.toLowerCase();
    
    for (const [key, theme] of Object.entries(themes)) {
        if (textLower.includes(key)) {
            return theme;
        }
    }
    
    // Default theme
    return {
        gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        emoji: '✨',
        tagline: 'Special & Memorable'
    };
}

// Export functions
async function downloadPNG() {
    try {
        const element = document.getElementById('cardPreview');
        const canvas = await html2canvas(element, {
            scale: 2,
            backgroundColor: null
        });
        const link = document.createElement('a');
        link.download = `${state.recipientName}_card.png`;
        link.href = canvas.toDataURL();
        link.click();
        showMessage('Card downloaded as PNG!', 'success');
    } catch (error) {
        showMessage('Error downloading card', 'error');
    }
}

async function downloadPDF() {
    try {
        const element = document.getElementById('cardPreview');
        const canvas = await html2canvas(element, {
            scale: 2,
            backgroundColor: null
        });
        
        const { jsPDF } = window;
        // Load jsPDF if not already loaded
        if (!jsPDF) {
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
            document.head.appendChild(script);
            await new Promise(resolve => script.onload = resolve);
        }
        
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 10, 10, 190, 277);
        pdf.save(`${state.recipientName}_card.pdf`);
        showMessage('Card downloaded as PDF!', 'success');
    } catch (error) {
        console.error('PDF error:', error);
        showMessage('Error downloading PDF. Try PNG instead.', 'error');
    }
}

function showMessage(msg, type) {
    const alertEl = document.getElementById('messageAlert');
    alertEl.className = type === 'error' ? 'error-message' : (type === 'success' ? 'success-message' : 'loading');
    alertEl.textContent = msg;
    
    if (type !== 'loading') {
        setTimeout(() => {
            alertEl.textContent = '';
            alertEl.className = '';
        }, 3000);
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('apiConfigModal');
    if (event.target === modal) {
        modal.classList.remove('show');
    }
}
