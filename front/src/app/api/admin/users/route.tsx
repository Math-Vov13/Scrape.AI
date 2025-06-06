import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const response = await fetch(`${process.env.API_URL || "http://localhost:8080/api/v1"}/users`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.status === 401 || response.status === 403) {
            return new Response(
                JSON.stringify({ error: 'Unauthorized' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        if (!response.ok) {
            const errorText = await response.text();
            return Response.json({ error: errorText }, { status: response.status });
        }
        const data = await response.json();
        return Response.json(data, { status: 200 });
        
    } catch (error) {
        //console.error('Error fetching users:', error);
        return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}