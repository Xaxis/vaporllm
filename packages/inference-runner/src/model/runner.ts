import { Loader } from "./loader.js";
import { Tokenizer } from "./tokenizer.js";

export interface RunnerConfig {
    modelUrl?: string;
    backend?: "auto" | "wasm" | "webgl" | "webgpu";
    enableCache?: boolean;
}

export class Runner {
    private loader: Loader;
    private tokenizer: Tokenizer;

    constructor(private config: RunnerConfig = {}) {
        this.loader = new Loader();
        this.tokenizer = new Tokenizer();
    }

    public async init(): Promise<void> {
        if (this.config.modelUrl) {
            await this.loader.loadModel(this.config.modelUrl);
        }
        // More logic to come...
    }

    public async runInference(input: string): Promise<string> {
        const tokens = this.tokenizer.tokenize(input);
        // Future: pass tokens to actual inference logic / backend
        return "Placeholder inference result";
    }
}
