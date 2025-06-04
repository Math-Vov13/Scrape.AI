type Response = {
    success: boolean;
    message: any;
    error: string | null;
}

export async function FetchFiles(): Promise<Response> {
    try {
        const response = await fetch('/api/admin/files/getAll', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch files');
        }

        const data = await response.json();
        return {
            success: true,
            message: data.message,
            error: null
        }
    } catch (error) {
        console.error('Failed to fetch files:', error);
        return {
            success: false,
            message: null,
            error: error instanceof Error ? error.message : 'Error fetching files'
        }
    }
}