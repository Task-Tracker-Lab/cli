import type { Config } from './schema.ts';

declare global {
    namespace NodeJs {
        type ProcessEnv = Config;
    }
}

export {};
