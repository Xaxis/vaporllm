import { Loader } from "./loader.js";
import { Tokenizer } from "./tokenizer.js";

import { Backend } from "../backends/backend.js";
import { WasmBackend } from "../backends/wasm.js";
// import { WebGLBackend } from "../backends/webgl.js";
// import { WebGPUBackend } from "../backends/webgpu.js";

export interface RunnerConfig {
    modelUrl?: string;
    backend?: "auto" | "wasm" | "webgl" | "webgpu";
    enableCache?: boolean;
}

export class Runner {
    private loader: Loader;
    private tokenizer: Tokenizer;
    private backend: Backend | null = null;

    constructor(private config: RunnerConfig = {}) {
        this.loader = new Loader();
        this.tokenizer = new Tokenizer();
    }

    public async init(): Promise<void> {
        // 1. Load the model
        if (this.config.modelUrl) {
            await this.loader.loadModel(this.config.modelUrl);
        }

        // 2. Decide which backend to use
        const chosenBackend = this.pickBackend();

        // 3. Instantiate and init the backend
        this.backend = this.createBackend(chosenBackend);
        await this.backend.init(this.loader.getArtifacts());

        console.log(`Runner initialized using ${chosenBackend} backend.`);
    }

    public async runInference(input: string): Promise<string> {
        if (!this.backend) {
            throw new Error("Runner is not initialized. Call init() first.");
        }

        // 1. Tokenize input
        const tokens = this.tokenizer.tokenize(input);
        console.log("Tokens:", tokens);

        // 2. Run backend inference on the tokens
        const outputTokens = await this.backend.runInference(tokens);

        // 3. (Optional) convert the output tokens back to a string
        // For now, just do a placeholder join
        const result = outputTokens.join(" ");
        return result;
    }

    private pickBackend(): "wasm" | "webgl" | "webgpu" {
        // If user set a specific one, just use it
        if (this.config.backend && this.config.backend !== "auto") {
            return this.config.backend;
        }

        // @TODO
        // This is "auto" detection logic for platform support (super naive example)
        // In real implementation, will have more sophisticated checks
        if (typeof WebAssembly !== "undefined") {
            return "wasm";
        }
        // else if (someWebGLCheck()) {
        //     return "webgl";
        // } else if (someWebGPUCheck()) {
        //     return "webgpu";
        // }
        // fallback
        return "wasm";
    }

    private createBackend(type: "wasm" | "webgl" | "webgpu"): Backend {
        switch (type) {
            case "webgl":
                // return new WebGLBackend();
                throw new Error("WebGL backend not yet implemented");
            case "webgpu":
                // return new WebGPUBackend();
                throw new Error("WebGPU backend not yet implemented");
            case "wasm":
            default:
                return new WasmBackend();
        }
    }
}
