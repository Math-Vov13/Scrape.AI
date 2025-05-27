(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["chunks/[root-of-the-server]__fb338bfa._.js", {

"[externals]/node:buffer [external] (node:buffer, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}}),
"[project]/src/app/api/chat/route.ts [app-edge-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "POST": (()=>POST),
    "runtime": (()=>runtime)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mistralai$2f$mistralai$2f$index$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@mistralai/mistralai/index.js [app-edge-route] (ecmascript)");
const runtime = 'edge';
;
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY || 'S2nqvZQmrdaRwhNhgcMT3M7uyHcjAK5D';
async function POST(request) {
    try {
        const { prompt } = await request.json();
        // Initialize Mistral client with API key
        const client = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$mistralai$2f$mistralai$2f$index$2e$js__$5b$app$2d$edge$2d$route$5d$__$28$ecmascript$29$__["default"](MISTRAL_API_KEY);
        // Create a TransformStream to pipe the response
        const stream = new TransformStream();
        const writer = stream.writable.getWriter();
        const encoder = new TextEncoder();
        // Start streaming response
        (async ()=>{
            try {
                // Start chat stream with the prompt
                const chatStream = await client.chatStream({
                    model: 'mistral-small',
                    messages: [
                        {
                            role: 'user',
                            content: prompt
                        }
                    ]
                });
                // Process each chunk
                for await (const chunk of chatStream){
                    if (chunk.choices[0]?.delta?.content !== undefined) {
                        const text = chunk.choices[0].delta.content;
                        await writer.write(encoder.encode(text));
                    }
                }
            } catch (error) {
                console.error('Stream error:', error);
            } finally{
                await writer.close();
            }
        })();
        // Return the readable stream to the client
        return new Response(stream.readable, {
            headers: {
                'Content-Type': 'text/plain; charset=utf-8',
                'Transfer-Encoding': 'chunked',
                'Cache-Control': 'no-cache'
            }
        });
    } catch (err) {
        console.error('Mistral API error:', err);
        return new Response(JSON.stringify({
            error: 'Error connecting to Mistral AI'
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}
}}),
}]);

//# sourceMappingURL=%5Broot-of-the-server%5D__fb338bfa._.js.map