type Response = {
    success: boolean;
    message: any;
    error: string | null;
}

export async function FetchFiles(): Promise<Response> {
    try {
        const response = await fetch('/api/admin/files/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            if (response.status === 404) {
                return {
                    success: true,
                    message: [],
                    error: 'No files found'
                };
            }
            throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        return {
            success: true,
            message: data.files,
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

export async function UploadFiles(files: FileList): Promise<Response> {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
    }
    formData.append('csrfToken', 'your_csrf_token_here'); // Replace with actual CSRF token if needed
    
    try {
        const response = await fetch("api/admin/files/upload", {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error uploading files:', errorText, 'Status:', response.status);
            throw new Error(errorText);
        }
        const data = await response.json();
        return {
            success: true,
            message: data.message || 'Files uploaded successfully',
            error: null
        }
        
    } catch (error) {
        console.error('Error uploading files:', error);
        return {
            success: false,
            message: null,
            error: error instanceof Error ? error.message : 'Error uploading files'
        }
    }    
}

export async function DeleteFiles(file_id: string): Promise<Response> {
    const formData = new FormData();
    formData.append('fileId', file_id);
    formData.append('csrfToken', 'your_csrf_token_here'); // Replace with actual CSRF token if needed

    try {
        const response = await fetch(`api/admin/files/delete`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error deleting file:', errorText, 'Status:', response.status);
            throw new Error(errorText);
        }
        const data = await response.json();
        return {
            success: true,
            message: data.message || 'File deleted successfully',
            error: null
        }
        
    } catch (error) {
        console.error('Error deleting file:', error);
        return {
            success: false,
            message: null,
            error: error instanceof Error ? error.message : 'Error deleting file'
        }
    }
}