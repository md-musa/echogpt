import { Injectable } from "@nestjs/common";
import { AiProviderAdapter, ChatMessage, ProviderHealthResult } from "./provider-adapter.interface";

@Injectable()
export class MockAdapter implements AiProviderAdapter {
    async healthCheck(): Promise<ProviderHealthResult> {
        return { healthy: true, message: 'Mock adapter — no real key checked' };
    }

    async chat(_apiKey: string, _model: string, _messages: ChatMessage[]): Promise<string> {
        return `This is a mock response`;
    }
}