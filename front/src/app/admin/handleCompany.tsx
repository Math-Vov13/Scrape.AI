type Response = {
    success: boolean;
    message: any;
    error: string | null;
}

export async function FetchCompany(): Promise<Response> {
    try {
        const response = await fetch('/api/admin/entreprise/getData', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch company data');
        }

        const data = await response.json();
        return {
            success: true,
            message: data.message,
            error: null
        }
    } catch (error) {
        console.error('Failed to fetch company:', error);
        return {
            success: false,
            message: null,
            error: error instanceof Error ? error.message : 'Error fetching company data'
        }
    }
}