type Response = {
    success: boolean;
    message: Tool[] | null;
    error: string | null;
}

interface ToolParameter {
  name: string;
  type: string;
  description: string;
  required: boolean;
  enum?: string[];
}

interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  parameters: ToolParameter[];
  examples: string[];
  usage_count: number;
  last_used: string;
  status: 'active' | 'inactive' | 'deprecated';
}

export async function FetchTools(): Promise<Response> {
    try {
        const response = await fetch('/tools_desc.json');
        const jsonData = await response.json();
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log('Tools fetched successfully:', jsonData);
        
        // The JSON is an object with tool names as keys, so convert to array of values
        const toolsArray = typeof jsonData === 'object' && jsonData !== null
            ? Object.values(jsonData)
            : [];
        const toolList = toolsArray.map((tool: any) => ({
            id: tool.id,
            name: tool.name,
            description: tool.description,
            category: tool.category,
            parameters: Array.isArray(tool.parameters) ? tool.parameters.map((param: any) => ({
                name: param.name,
                type: param.type,
                description: param.description,
                required: param.required,
                enum: param.enum || []
            })) : [],
            examples: tool.examples || [],
            usage_count: tool.usage_count || 0,
            last_used: tool.last_used || '',
            status: tool.status || 'active'
        })) as Tool[];

        return {
            success: true,
            message: toolList,
            error: null
        }
    } catch (error) {
        console.error('Failed to fetch tools:', error);
        return {
            success: false,
            message: null,
            error: error instanceof Error ? error.message : 'Error fetching tools'
        }
    }
}