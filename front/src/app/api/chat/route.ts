import { NextRequest } from 'next/server';

type ChatHistory = {
  id: string;             // Unique identifier for the chat history
  role: string;           // Role of the user in the chat (e.g., "user", "admin")
  content: string;        // Array of messages in the chat history
  createdAt: Date;        // Timestamp of when the chat history was created
}

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY || 'S2nqvZQmrdaRwhNhgcMT3M7uyHcjAK5D';

export async function POST(request: NextRequest) {
  try {
    const { History } = await request.json();

    // Add a System Prompt here :)
    const full_history = History.map((msg: { role: any; content: any; }) => ({
      role: msg.role,
      content: msg.content,
    }));
    
    // Use fetch directly instead of the Mistral SDK to avoid constructor issues
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'mistral-small',
        messages: full_history,
        stream: true,
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('ScrapeAI API error:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: `ScrapeAI API error: ${response.status}` }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!response.body) {
      return new Response(
        JSON.stringify({ error: 'No response body from ScrapeAI API' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create a TransformStream to process the SSE stream
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    // Process the streaming response
    (async () => {
      try {
        const reader = response.body!.getReader();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith('data: ')) continue;
            
            const data = trimmed.slice(6); // Remove 'data: '
            if (data === '[DONE]') break;

            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                await writer.write(encoder.encode(content));
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      } catch (error) {
        console.error('Stream processing error:', error);
      } finally {
        await writer.close();
      }
    })();

    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (err) {
    console.error('ScrapeAI API error:', err);
    return new Response(
      JSON.stringify({ error: 'Error connecting to ScrapeAI Chatbot' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}