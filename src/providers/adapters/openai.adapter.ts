import { Injectable } from "@nestjs/common";
import { AiProviderAdapter, ProviderHealthResult } from "./provider-adapter.interface";

@Injectable()
export class OpenAiAdapter implements AiProviderAdapter {
    async healthCheck(apiKey: string): Promise<ProviderHealthResult> {
        try {
            const res = await fetch('https://api.openai.com/v1/models', {
                headers: { Authorization: `Bearer ${apiKey}` },
            });
            return { healthy: res.ok, message: res.ok ? 'OK' : `Status ${res.status}` };
        } catch (err) {
            return { healthy: false, message: err instanceof Error ? err.message : String(err) };
        }
    }
}