<template>
  <div class="chat-page">
    <header class="app-header">
      <h1 class="app-title">Scrape.ia</h1>
      <button class="logout-button" @click="handleLogout">
        <span>Déconnexion</span>
      </button>
    </header>
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
      </div>
      <div class="input-area">
        <form @submit.prevent="handleSend">
          <textarea
            v-model="inputText"
            placeholder="Écrivez votre message..."
            :disabled="isLoading"
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
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const inputText = ref('');
const messages = ref([]);
const messagesContainer = ref(null);
const textareaRef = ref(null);
const isLoading = ref(false);

const handleLogout = () => {
  router.push('/');
};

const scrollToBottom = async () => {
  await nextTick();
  if (messagesContainer.value) {
    setTimeout(() => {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }, 10);
  }
};

const adjustTextareaHeight = () => {
  const textarea = textareaRef.value;
  if (!textarea) return;
  
  textarea.style.height = 'auto';
  const newHeight = Math.min(Math.max(textarea.scrollHeight, 50), 120);
  textarea.style.height = `${newHeight}px`;
  
  if (textarea.scrollHeight > 120) {
    textarea.classList.add('show-scrollbar');
  } else {
    textarea.classList.remove('show-scrollbar');
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
  
  messages.value.push({ sender: 'user', text });
  inputText.value = '';
  isLoading.value = true;
  
  if (textareaRef.value) {
    textareaRef.value.style.height = '50px';
    textareaRef.value.classList.remove('show-scrollbar');
  }
  
  await scrollToBottom();
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
.chat-page {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-base);
}

.app-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  padding: 12px 20px;
  background-color: var(--bg-panel);
  border-bottom: 1px solid #2a2a2a;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  z-index: 10;
}

.app-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--accent);
}

.logout-button {
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-color: rgba(42, 42, 42, 0.7);
  color: var(--text-primary);
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
}

.logout-button:hover {
  background-color: rgba(65, 65, 65, 0.9);
  transform: translateY(-2px);
}

.chat-wrapper {
  width: 100%;
  height: 100%;
  padding-top: 60px;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-panel);
  overflow: hidden;
  position: relative;
  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.1));
}

.messages {
  flex: 1;
  padding: 20px 20px 100px 20px;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 70%;
  margin: 0 auto;
  margin-top: -10px;
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
  max-height: 400px;
  overflow-y: auto;
}

.message::-webkit-scrollbar {
  width: 6px;
  background-color: transparent;
}

.message::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  margin: 4px 0;
}

.message::-webkit-scrollbar-thumb {
  background-color: var(--accent);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background-clip: padding-box;
  min-height: 40px;
  opacity: 0.7;
  transition: opacity 0.3s;
}

.message::-webkit-scrollbar-thumb:hover {
  opacity: 1;
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
  min-height: 82px;
  width: 70%;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 12px 12px 0 0;
}

.input-area form {
  position: relative;
  width: calc(100% - 70px);
  display: flex;
  align-items: center;
  border-radius: 20px;
}

.input-area textarea {
  flex: 1;
  padding: 14px 10px 14px 14px;
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  background-color: rgba(42, 42, 42, 0.7);
  color: var(--text-primary);
  font-size: 15px;
  resize: none;
  min-height: 50px;
  max-height: 120px;
  font-family: inherit;
  transition: background-color 0.2s, border-color 0.2s, height 0.2s ease;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.2);
  overflow-y: hidden;
  box-sizing: border-box;
}

.input-area textarea.show-scrollbar {
  overflow-y: auto;
  overflow-x: hidden;
}

.input-area textarea::-webkit-scrollbar {
  width: 4px;
  background-color: transparent;
}

.input-area textarea::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  margin: 6px 0;
}

.input-area textarea::-webkit-scrollbar-thumb {
  background-color: var(--accent);
  border-radius: 10px;
  min-height: 30px;
  opacity: 0.7;
  transition: opacity 0.3s;
}

.input-area textarea::-webkit-scrollbar-thumb:hover {
  opacity: 1;
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
</style>
