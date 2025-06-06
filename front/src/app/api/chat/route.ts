import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

// const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;


export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { History } = await request.json();

    // Add a System Prompt here :)
    const full_history = History.map((msg: { role: any; content: any; }) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Use fetch directly instead of the Mistral SDK to avoid constructor issues
    // const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${MISTRAL_API_KEY}`,
    //   },
    //   body: JSON.stringify({
    //     model: 'mistral-small',
    //     messages: full_history,
    //     stream: true,
    //   }),
    // });

    const response = await fetch(`${process.env.API_URL || "http://localhost:8080/api/v1"}/chat/completion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        model: 'gpt-4.1-nano',
        messages: full_history,
        temperature: 0.2,
        max_tokens: 5000,
      }),
    });

    if (response.status === 401) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

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
      // try {
      //   const reader = response.body!.getReader();
      //   let buffer = '';

      //   while (true) {
      //     const { done, value } = await reader.read();
      //     if (done) break;

      //     buffer += decoder.decode(value, { stream: true });
      //     const lines = buffer.split('\n');
      //     buffer = lines.pop() || '';

      //     for (const line of lines) {
      //       const trimmed = line.trim();
      //       if (!trimmed || !trimmed.startsWith('data: ')) continue;

      //       const data = trimmed.slice(6); // Remove 'data: '
      //       if (data.startsWith('[DONE]') || data.startsWith('[ERROR]')) break;

      //       try {
      //         const parsed = JSON.parse(data);
      //         const content = parsed.choices?.[0]?.delta?.content;
      //         if (content) {
      //           await writer.write(encoder.encode(content));
      //         }
      //       } catch (e) {
      //         // Skip invalid JSON
      //       }
      //     }
      //   }
      // } catch (error) {
      //   console.error('Stream processing error:', error);
      // } finally {
      //   await writer.close();
      // }
      try {
        const reader = response.body!.getReader();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

            buffer += decoder.decode(value, { stream: true });
            let lines = buffer.split('<||CHUNK||>');
            buffer = lines.pop() || '';
            lines = lines.filter(line => line.trim() !== '');

          for (const line of lines) {
            if (line.startsWith('[DONE]')) break;

            const dataType = line.split(':')[0];
            var data = line.slice(dataType.length + 2); // Remove type prefix and colon
            if (!data) continue; // Skip empty lines

            if (dataType === 'data' || dataType === 'tool') {
              // Handle regular data messages
              if (dataType === 'tool') {
                data = '<||TOOL||>' + data.trim() + '<||END_TOOL||>';
              }
              try {
                await writer.write(encoder.encode(data));
              } catch (e) {
                // Handle write errors
                console.error('Write error:', e);
              }

            } else if (dataType === 'error') {
              console.error('Error from stream:', line);
              await writer.write(encoder.encode("[ERROR]"));
              return;
              
            } else {
              console.warn('Unknown data type:', dataType);
              await writer.write(encoder.encode("[ERROR]"));
              return;
            }
          }
        }
      } catch (error) {
        console.error('Stream processing error:', error);
      } finally {
        await writer.close();
      }
    })();

    console.log('Stream processing completed successfully');

    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
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