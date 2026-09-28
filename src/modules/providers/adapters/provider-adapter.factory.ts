import { Injectable, NotImplementedException } from "@nestjs/common";
import { OpenAiAdapter } from "./openai.adapter";
import { MockAdapter } from "./mock.adapter";
import { AiProviderAdapter } from "./provider-adapter.interface";
import { ProviderType } from "../../../generated/prisma/enums";

@Injectable()
export class ProviderAdapterFactory {
    constructor(
        private openai: OpenAiAdapter,
        private mock: MockAdapter,
    ) { }

    getAdapter(type: ProviderType): AiProviderAdapter {
        if (process.env.USE_MOCK_PROVIDERS === 'true') return this.mock;
        switch (type) {
            case 'OPENAI': return this.openai;
            case 'ANTHROPIC':
            case 'GEMINI':
                throw new NotImplementedException(`Chat is not implemented for ${type}`);
        }
    }
}