import { Injectable } from "@nestjs/common";
import { AiProviderAdapter, ProviderHealthResult } from "./provider-adapter.interface";

@Injectable()
export class MockAdapter implements AiProviderAdapter {
    async healthCheck(): Promise<ProviderHealthResult> {
        return { healthy: true, message: 'Mock adapter — no real key checked' };
    }
}