document.addEventListener('DOMContentLoaded', () => {
    const bubble = document.getElementById('catgpt-bubble');
    const chatWindow = document.getElementById('catgpt-window');
    const closeBtn = document.getElementById('catgpt-close');
    const input = document.getElementById('catgpt-input');
    const messages = document.getElementById('catgpt-messages');

    // Abrir y cerrar chat
    bubble.addEventListener('click', () => chatWindow.style.display = 'flex');
    closeBtn.addEventListener('click', () => chatWindow.style.display = 'none');

    // Agregar mensajes al chat
    function addMessage(text, sender) {
        const div = document.createElement('div');
        div.textContent = text;
        div.className = sender === 'user' ? 'user-message' : 'ai-message';
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    }

    // Enviar mensaje a la IA
    input.addEventListener('keypress', async (e) => {
        if(e.key === 'Enter' && input.value.trim() !== '') {
            const userMessage = input.value;
            addMessage(userMessage, 'user');
            input.value = '';

            try {
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY

                    },
                    body: JSON.stringify({
                        model: "gpt-4",
                        messages: [
                            { role: "system", content: "Eres CatGPT, un asistente gatuno amigable. Solo responde basado en la información de la página: Felinos en En Accion es una página que busca solucionar la pérdida de biodiversidad, enfocada en los felinos que están en peligro de extinción." },
                            { role: "user", content: userMessage }
                        ]
                    })
                });

                const data = await response.json();
                const aiMessage = data.choices[0].message.content;
                addMessage(aiMessage, 'ai');

            } catch(err) {
                addMessage("¡Ups! Algo salió mal 😿", 'ai');
                console.error(err);
            }
        }

    });
});

