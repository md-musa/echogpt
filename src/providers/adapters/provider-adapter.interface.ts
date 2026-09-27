export interface ProviderHealthResult {
    healthy: boolean;
    message?: string;
}

export interface AiProviderAdapter {
    healthCheck(apiKey: string, model: string): Promise<ProviderHealthResult>;
    // chat(...) added tomorrow with the Chat module
}