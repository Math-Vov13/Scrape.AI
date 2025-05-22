<template>
  <div class="chat-wrapper">
    <div class="messages" ref="messagesContainer">
      <div
        v-for="(msg, idx) in messages"
        :key="idx"
        :class="['message', msg.sender]"
      >
        <span>{{ msg.text }}</span>
      </div>
    </div>

    <form class="input-area" @submit.prevent="handleSend">
      <input
        v-model="inputText"
        type="text"
        placeholder="Tape ton message…"
        :disabled="isLoading"
        autocomplete="off"
      />
      <button type="submit" :disabled="isLoading">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--accent)">
          <path d="M2,21L23,12L2,3V10L17,12L2,14V21Z" />
        </svg>
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';

const inputText = ref('');
const messages = ref([]);
const messagesContainer = ref(null);
const isLoading = ref(false);

const scrollToBottom = async () => {
  await nextTick();
  const el = messagesContainer.value;
  if (el) el.scrollTop = el.scrollHeight;
};

onMounted(scrollToBottom);

async function handleSend() {
  const text = inputText.value.trim();
  if (!text) return;

  // Ajouter message utilisateur
  messages.value.push({ sender: 'user', text });
  inputText.value = '';
  isLoading.value = true;
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
  max-width: 600px;
  height: 80vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-panel);
  border-radius: 12px;
  overflow: hidden;
}

.messages {
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--bg-base) var(--bg-panel);
}

.messages::-webkit-scrollbar {
  width: 6px;
}

.messages::-webkit-scrollbar-thumb {
  background-color: var(--bg-base);
  border-radius: 3px;
}

.message {
  margin-bottom: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  max-width: 75%;
  word-wrap: break-word;
  line-height: 1.5;
}

.message.user {
  align-self: flex-end;
  background-color: var(--accent);
  color: var(--bg-base);
}

.message.bot {
  align-self: flex-start;
  background-color: #2a2a2a;
  color: var(--text-primary);
}

.input-area {
  display: flex;
  border-top: 1px solid #2a2a2a;
  background-color: var(--bg-panel);
  padding: 12px;
}

.input-area input {
  flex: 1;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background-color: #2a2a2a;
  color: var(--text-primary);
  font-size: 14px;
}

.input-area input::placeholder {
  color: var(--text-secondary);
}

.input-area button {
  margin-left: 8px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.input-area button:disabled svg {
  opacity: 0.5;
}

.input-area button svg:hover {
  transform: translateX(2px);
  transition: transform 0.2s;
}
</style>
