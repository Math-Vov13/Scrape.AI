import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const filesForm = await request.formData();

        const response = await fetch(`${process.env.API_URL || "http://localhost:8080/api/v1"}/admin/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: filesForm,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error creating user:', errorText, 'Status:', response.status);
            return Response.json({ error: errorText }, { status: response.status });
        }

        const data = await response.json();
        return Response.json(data, { status: 200 });
    } catch (error) {
        console.error('Error creating user:', error);
        return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}