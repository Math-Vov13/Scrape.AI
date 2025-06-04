type Response = {
    success: boolean;
    message: any;
    error: string | null;
}

type CreateUser = {
    username: string;
    email: string;
    password: string;
    role: string; // e.g., 'admin', 'user', etc.
}

export async function FetchUsers(): Promise<Response> {
    try {
        const response = await fetch('/api/admin/users/getAllUsers', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        return {
            success: true,
            message: data.message,
            error: null
        }
    } catch (error) {
        console.error('Failed to fetch users:', error);
        return {
            success: false,
            message: null,
            error: error instanceof Error ? error.message : 'Error fetching users'
        }
    }
}

export async function CreateUsers(user_data: string) {
    const response = await fetch("api/admin/users/createUser", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: user_data,
    });
}

export async function DeleteUser(user_id: string) {
    const response = await fetch(`api/admin/users/deleteUser/${user_id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    });
}