import { ProviderType } from '../../generated/prisma/enums';

export async function checkProviderHealth(
    type: ProviderType,
    apiKey: string,
): Promise<{ healthy: boolean; message: string }> {
    if (process.env.USE_MOCK_PROVIDERS === 'true') {
        return { healthy: true, message: 'Mock - no real key checked' };
    }

    try {
        let response: Response;
        switch (type) {
            case 'OPENAI':
                response = await fetch('https://api.openai.com/v1/models', {
                    headers: { Authorization: `Bearer ${apiKey}` },
                });
                break;
            case 'ANTHROPIC':
                response = await fetch('https://api.anthropic.com/v1/models', {
                    headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
                });
                break;
            case 'GEMINI':
                response = await fetch(
                    `https://generativelanguage.googleapis.com/v1/models?key=${encodeURIComponent(apiKey)}`,
                );
                break;
            default:
                throw new Error(`Unsupported provider type: ${type satisfies never}`);
        }
        return { healthy: response.ok, message: `Status ${response.status}` };
    } catch (error) {
        return {
            healthy: false,
            message: error instanceof Error ? error.message : String(error),
        };
    }
}