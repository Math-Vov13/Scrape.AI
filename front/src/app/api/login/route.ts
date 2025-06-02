import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    try {
        if (!request.body) {
            return new Response(JSON.stringify({ error: 'No data provided' }), { status: 400 });
        }
        const { email, password } = await request.json();

        const response = await fetch(`${process.env.API_URL || "http://localhost:8080/api/v1"}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({email: email, password: password }),
        });
        const data = await response.json();

        // Create FormData to send to the token endpoint
        const params = new URLSearchParams();
        params.append('grant_type', 'password');
        params.append('username', email);
        params.append('password', password);

        const token_response = await fetch(`${process.env.API_URL || "http://localhost:8080/api/v1"}/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params.toString(),
        });

        if (!token_response.ok) {
            const errorText = await token_response.text();
            console.error('Token API error:', token_response.status, errorText);
            return new Response(
                JSON.stringify({ error: `Token API error: ${token_response.status}` }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const token_data = await token_response.json();

        const html_res = new Response(JSON.stringify(data), {
            status: response.status,
            headers: { 'Content-Type': 'application/json' },
        });
        html_res.headers.set('Set-Cookie', `token=${token_data.access_token}; Path=/; HttpOnly; Secure; SameSite=Strict`);
        return html_res;

    } catch (error) {
        console.error('API Error details:', error instanceof Error ? error.message : error);
        return new Response(JSON.stringify({ error: 'Login failed' }), { status: 400 });
    }
}