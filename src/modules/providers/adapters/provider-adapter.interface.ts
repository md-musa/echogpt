export interface ProviderHealthResult {
    healthy: boolean;
    message?: string;
}

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface AiProviderAdapter {
    healthCheck(apiKey: string, model: string): Promise<ProviderHealthResult>;
    chat(apiKey: string, model: string, messages: ChatMessage[]): Promise<string>;
}