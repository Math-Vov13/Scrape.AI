<template>
  <div class="chat-wrapper">
    <div class="messages" ref="messagesContainer">
      <div v-if="messages.length === 0" class="welcome-message">
        <h2>Comment puis-je vous aider aujourd'hui ?</h2>
      </div>
      <div
        v-for="(msg, idx) in messages"
        :key="idx"
        :class="['message', msg.sender]"
      >
        <span>{{ msg.text }}</span>
      </div>
    </div>    <div class="input-area">
      <form @submit.prevent="handleSend">
        <textarea
          v-model="inputText"
          placeholder="Écrivez votre message..."
          :disabled="isLoading"
          rows="1"
          ref="textareaRef"
          @input="adjustTextareaHeight"
          @keydown="handleKeydown"
        ></textarea>
      </form>
      <button 
        type="button" 
        class="send-button" 
        :disabled="isLoading || !inputText.trim()" 
        @click="handleSend"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
          <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';

const inputText = ref('');
const messages = ref([]);
const messagesContainer = ref(null);
const textareaRef = ref(null);
const isLoading = ref(false);

const scrollToBottom = async () => {
  await nextTick();
  const el = messagesContainer.value;
  if (el) {
    // Utiliser un petit délai pour s'assurer que le contenu est rendu
    setTimeout(() => {
      el.scrollTop = el.scrollHeight;
    }, 10);
  }
};

const adjustTextareaHeight = () => {
  const textarea = textareaRef.value;
  if (textarea) {
    textarea.style.height = 'auto';
    const maxHeight = 120; // hauteur maximum environ 5 lignes
    const newHeight = Math.min(textarea.scrollHeight, maxHeight);
    textarea.style.height = newHeight + 'px';
  }
};

const handleKeydown = (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    handleSend();
  }
};

onMounted(scrollToBottom);

async function handleSend() {
  const text = inputText.value.trim();
  if (!text) return;

  // Ajouter message utilisateur
  messages.value.push({ sender: 'user', text });
  inputText.value = '';
  isLoading.value = true;
  
  // Reset textarea height
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto';
  }
  
  await scrollToBottom();

  // Préparer bulle vide pour streaming réponse
  messages.value.push({ sender: 'bot', text: '' });
  try {
    const apiKey = import.meta.env.VITE_MISTRAL_API_KEY;
    if (!apiKey) {
      throw new Error('Missing API key. Please set VITE_MISTRAL_API_KEY in your .env file.');
    }

    const url = import.meta.env.VITE_USE_PROXY === 'true'
      ? '/mistral/v1/chat/completions'
      : 'https://api.mistral.ai/v1/chat/completions';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'mistral-small',
        messages: [{ role: 'user', content: text }],
        stream: true
      })
    });

    if (!response.ok || !response.body) {
      throw new Error(`Network error: ${response.status}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let buffer = '';
    let botText = '';

    while (!done) {
      const { value, done: streamDone } = await reader.read();
      if (value) {
        buffer += decoder.decode(value, { stream: true });
        const parts = buffer.split('\n\n');
        buffer = parts.pop() || '';
        for (const part of parts) {
          if (part.startsWith('data: ')) {
            const dataStr = part.replace(/^data: /, '').trim();
            if (dataStr === '[DONE]') {
              done = true;
              break;
            }
            try {
              const json = JSON.parse(dataStr);
              const delta = json.choices[0].delta.content;
              if (delta) {
                botText += delta;
                messages.value[messages.value.length - 1].text = botText;
                await scrollToBottom();
              }
            } catch (e) {
              console.error('Parsing SSE chunk error', e);
            }
          }
        }
      }
      done = done || streamDone;
    }
  } catch (error) {
    console.error('Streaming error:', error);
    messages.value[messages.value.length - 1].text = `❌ Erreur streaming: ${error.message}`;
  } finally {
    isLoading.value = false;
    await scrollToBottom();
  }
}
</script>

<style scoped>
.chat-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-panel);
  overflow: hidden;
  position: relative;
  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1));
}

.messages {
  flex: 1;
  padding: 20px 20px 80px 20px; /* Ajouter plus d'espace en bas pour compenser la zone de saisie */
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: var(--accent) transparent;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 70%; /* Limiter la largeur à 70% */
  margin: 0 auto; /* Centrer horizontalement */
  margin-top: -10px; /* Monter légèrement */
}

.messages::-webkit-scrollbar {
  width: 6px;
  background-color: transparent;
}

.messages::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  margin: 4px 0;
}

.messages::-webkit-scrollbar-thumb {
  background-color: var(--accent);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-clip: padding-box;
  min-height: 40px;
  opacity: 0.7;
  transition: opacity 0.3s;
}

.messages::-webkit-scrollbar-thumb:hover {
  opacity: 1;
}

.welcome-message {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-primary);
}

.welcome-message h2 {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  color: var(--accent);
}

.message {
  margin-bottom: 16px;
  padding: 14px 18px;
  border-radius: 18px;
  max-width: 80%;
  word-wrap: break-word;
  line-height: 1.5;
  width: fit-content;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.message.user {
  align-self: flex-end;
  background-color: var(--accent);
  color: white;
  margin-left: auto;
  border-radius: 18px 18px 4px 18px;
  background-image: linear-gradient(135deg, #4b8ef3, #3875e0);
}

.message.bot {
  align-self: flex-start;
  background-color: #2a2a2a;
  color: var(--text-primary);
  border-radius: 4px 18px 18px 18px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.input-area {
  display: flex;
  border-top: 1px solid #2a2a2a;
  background-color: var(--bg-panel);
  padding: 16px;
  align-items: center;
  width: 70%; /* Même largeur que la zone de messages */
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%); /* Pour centrer avec la transformation */
  border-radius: 12px 12px 0 0; /* Arrondir les coins supérieurs */
}

.input-area form {
  position: relative;
  width: calc(100% - 70px); /* Laisser de l'espace pour le bouton */
  display: flex;
  align-items: center;
}

.input-area textarea {
  flex: 1;
  padding: 14px;
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  background-color: rgba(42, 42, 42, 0.7);
  color: var(--text-primary);
  font-size: 15px;
  resize: none;
  min-height: 24px;
  max-height: 120px;
  font-family: inherit;
  transition: background-color 0.2s, border-color 0.2s;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
}

.input-area textarea:focus {
  outline: none;
  border-color: var(--accent);
  background-color: rgba(50, 50, 50, 0.9);
}

.input-area textarea::placeholder {
  color: var(--text-secondary);
}

.send-button {
  margin-left: 12px;
  background: linear-gradient(135deg, #4b8ef3, #3875e0);
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 2;
  flex-shrink: 0;
}

.send-button:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: linear-gradient(135deg, #808080, #606060);
}

.send-button svg {
  fill: white;
  width: 22px;
  height: 22px;
}

/* Animation pour le chargement de réponses */
@keyframes pulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}

.message.bot:empty::after {
  content: "...";
  animation: pulse 1.5s infinite;
}
</style>
