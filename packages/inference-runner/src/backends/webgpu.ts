import { Backend } from "./backend.js";

export class WebGPUBackend implements Backend {
    public async init(modelArtifacts: ArrayBuffer[]): Promise<void> {
        // ...
    }

    public async runInference(inputTokens: number[]): Promise<number[]> {
        // ...
        return [];
    }
}