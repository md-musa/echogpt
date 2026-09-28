import { Injectable } from "@nestjs/common";
import { AiProviderAdapter, ChatMessage, ProviderHealthResult } from "./provider-adapter.interface";

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

    async chat(apiKey: string, model: string, messages: ChatMessage[]): Promise<string> {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ model, messages }),
        });
        const result = await response.json() as {
            choices?: { message?: { content?: string | null } }[];
        };
        if (!response.ok) throw new Error(`OpenAI request failed with status ${response.status}`);

        const reply = result.choices?.[0]?.message?.content;
        if (typeof reply !== 'string') throw new Error('OpenAI returned no message content');
        return reply;
    }
}