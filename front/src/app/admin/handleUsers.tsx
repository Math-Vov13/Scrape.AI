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
        const response = await fetch('/api/admin/users/', {
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
            message: data.users,
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

export async function DeleteUser(user_id: string): Promise<Response> {
    const formData = new FormData();
    formData.append('userId', user_id);
    formData.append('csrfToken', 'your_csrf_token_here'); // Replace with actual CSRF token if needed

    try {
        const response = await fetch(`api/admin/users/deleteUser`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error deleting user:', errorText, 'Status:', response.status);
            throw new Error(errorText);
        }
        const data = await response.json();
        return {
            success: true,
            message: data.message || 'User deleted successfully',
            error: null
        }
        
    } catch (error) {
        console.error('Error deleting user:', error);
        return {
            success: false,
            message: null,
            error: error instanceof Error ? error.message : 'Error deleting user'
        }
    }
}