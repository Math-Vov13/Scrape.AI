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
        console.log('API Response:', response);
        const data = await response.json();
        console.log('API Data:', data);

        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('API Error details:', error instanceof Error ? error.message : error);
        return new Response(JSON.stringify({ error: 'Login failed' }), { status: 400 });
    }
}