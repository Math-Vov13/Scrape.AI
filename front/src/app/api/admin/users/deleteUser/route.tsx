import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const userId = formData.get('userId')?.toString();

    try {
        const response = await fetch(`${process.env.API_URL || "http://localhost:8080/api/v1"}/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error deleting users:', errorText, 'Status:', response.status);
            return Response.json({ error: errorText }, { status: response.status });
        }

        return Response.json({ message: 'Users deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting users:', error);
        return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}