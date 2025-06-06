import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const userForm = await request.formData();
        const userData = new Map<string, any>();
        userForm.forEach((value, key) => {
            if (key === 'admin') {
                // Convert 'admin' field to boolean
                userData.set(key, value === 'true'? true : false)
            }
            userData.set(key, value);
        });

        const response = await fetch(`${process.env.API_URL || "http://localhost:8080/api/v1"}/users/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(Object.fromEntries(userData.entries())),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error creating user:', errorText, 'Status:', response.status);
            return Response.json({ error: errorText }, { status: response.status });
        }

        const data = await response.json();

        return Response.json(
            { message: 'User created successfully', data: Object.fromEntries(userData.entries()) },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error creating user:', error);
        return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}