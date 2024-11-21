let chatHistory = [];

async function sendMessage() {
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const chatHistoryCtn = document.getElementById('chatHistoryCtn');

    if (!userInput.value.trim()) return;

    // Add user message to chat
    addMessageToChat('You', userInput.value);

    // Disable input and button, show loading
    userInput.disabled = true;
    sendBtn.disabled = true;
    sendBtn.textContent = "⏳ Thinking...";

    // Generate Bob's response
    try {
        let bobResponse = await generateBobResponse(userInput.value);
        addMessageToChat('Bob', bobResponse);
    } catch (error) {
        addMessageToChat('Error', 'Failed to get a response from the AI.');
        console.error('Error fetching response:', error);
    }

    // Re-enable input and button
    userInput.value = '';
    userInput.disabled = false;
    sendBtn.disabled = false;
    sendBtn.textContent = "Send";
}

function addMessageToChat(sender, message) {
    chatHistory.push({ sender, message });
    updateChatDisplay();
}

function updateChatDisplay() {
    const chatHistoryCtn = document.getElementById('chatHistoryCtn');
    chatHistoryCtn.innerHTML = chatHistory.map(msg =>
        `<p><strong>${msg.sender}:</strong> ${msg.message}</p>`
    ).join('');
    chatHistoryCtn.scrollTop = chatHistoryCtn.scrollHeight;
}

// Allow sending message with Enter key
document.getElementById('userInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') sendMessage();
});

// AI model for generating Bob's responses using Hugging Face API
async function generateBobResponse(userMessage) {
    const apiKey = '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';
    const model = 'gpt2';
    const prompt = `User: ${userMessage}\nBob:`;

    try {
        const response = await axios.post(`https://api-inference.huggingface.co/models/${model}`, {
            inputs: prompt,
        }, {
            headers: { 'Authorization': `Bearer ${apiKey}` }
        });

        console.log('API Response:', response);

        if (response.data && response.data[0] && response.data[0].generated_text) {
            return response.data[0].generated_text.split('Bob:')[1].trim();
        } else {
            console.error('Unexpected response format:', response.data);
            throw new Error('Unexpected response format from AI.');
        }
    } catch (error) {
        console.error('Error generating response:', error);
        throw error;
    }
}
